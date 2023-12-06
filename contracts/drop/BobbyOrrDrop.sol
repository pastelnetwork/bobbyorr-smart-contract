// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

/**
 * @title PastelSmartMintDrop
 *
 */

contract BobbyOrrDrop is
    Initializable,
    UUPSUpgradeable,
    ERC721Upgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    string public baseURI;
    uint256 public price;
    address public primaryWallet;
    address public pastelWallet;
    uint256 public stage; // 0 => FanClub, 1 => PrivateSale, 2 => PublicSale
    uint256[] public allowListFanClubUsers;
    uint256[] public allowListWhiteListUsers;

    event Minted(address indexed _to, uint256 _userId, uint256 _tokenId);
    event BaseURIChanged(string _uri);

    uint256 private nextTokenId;
    bool private initialized;

    modifier onlyValidToken(uint256 _tokenId) {
        require(_exists(_tokenId), "Invalid token id");
        _;
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI,
        uint256 _price,
        address _primaryWallet,
        address _pastelWallet
    ) public initializer {
        require(!initialized, "Already initialized");
        require(
            _primaryWallet != address(0) && _pastelWallet != address(0),
            "Invalid primary, or pastel wallet address"
        );

        __ERC721_init(_name, _symbol);
        __Ownable_init();
        baseURI = _baseTokenURI;
        price = _price;
        primaryWallet = _primaryWallet;
        pastelWallet = _pastelWallet;

        nextTokenId = 1;
        initialized = true;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function mint(uint256 _userId) external payable nonReentrant {
        bool isFanClubUser = false;
        bool isWhiteListUser = false;

        for (uint256 i = 0; i < allowListFanClubUsers.length; i++) {
            if (allowListFanClubUsers[i] == _userId) {
                isFanClubUser = true;
                break;
            }
        }
        for (uint256 i = 0; i < allowListWhiteListUsers.length; i++) {
            if (allowListWhiteListUsers[i] == _userId) {
                isWhiteListUser = true;
                break;
            }
        }

        if (stage == 0) {
            require(isFanClubUser);
        } else if (stage == 1) {
            require(isWhiteListUser);
        }

        require(msg.value == price, "Insufficient price");

        _safeMint(msg.sender, nextTokenId);

        emit Minted(msg.sender, _userId, nextTokenId);

        nextTokenId += 1;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata _uri) external onlyOwner {
        baseURI = _uri;

        emit BaseURIChanged(_uri);
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function setPrimaryWallet(address _primaryWallet) external onlyOwner {
        require(_primaryWallet != address(0), "Invalid primary wallet address");

        primaryWallet = _primaryWallet;
    }

    function setStage(uint256 _stage) external onlyOwner {
        require(_stage < 3 && _stage >= 0, "Invalid stage");

        if (_stage == 0) {
            price = 10000000000000000;
        } else if (_stage == 1) {
            price = 20000000000000000;
        } else {
            price = 40000000000000000;
        }

        stage = _stage;
    }

    function setAllowListFanClubUsers(uint256[] memory _allowListFanClubUsers) external onlyOwner {
        allowListFanClubUsers = _allowListFanClubUsers;
    }

    function setAllowListWhiteListUsers(uint256[] memory _allowListWhiteListUsers) external onlyOwner {
        allowListWhiteListUsers = _allowListWhiteListUsers;
    }

    function totalBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId - 1;
    }

    function withdraw() external onlyOwner nonReentrant {
        require(
            address(this).balance > 0 && pastelWallet != address(0),
            "No funds to withdraw, or invalid wallet address to send."
        );

        payable(pastelWallet).transfer(address(this).balance);

        address payable to = payable(msg.sender);
        require(to != address(0), "Invalid recipient address");
        AddressUpgradeable.sendValue(to, address(this).balance);
    }
}
