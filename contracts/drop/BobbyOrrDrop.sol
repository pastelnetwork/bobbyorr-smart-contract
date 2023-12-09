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
    uint256 public maxSupply;
    uint256 public stage; // 0 => FanClub, 1 => PrivateSale, 2 => PublicSale
    mapping(uint256 => bool) public isFanClubUser;
    mapping(uint256 => bool) public isWhitelisted;
    mapping(uint256 => bool) public hasUserMinted;
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
        uint256 _maxSupply,
        string memory _baseTokenURI,
        address _primaryWallet
    ) public initializer {
        require(!initialized, "Already initialized");
        require(_primaryWallet != address(0), "Invalid primary, or pastel wallet address");

        __ERC721_init(_name, _symbol);
        __Ownable_init();
        baseURI = _baseTokenURI;
        primaryWallet = _primaryWallet;

        maxSupply = _maxSupply;
        nextTokenId = 1;
        initialized = true;
        stage = 0;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function mint(uint256 _userId, address _to, uint256 _quantity) external payable nonReentrant {
        require(_quantity == 1, "Users can only mint one token at a time");
        require(stage > 0, "Not started minting yet");

        if (stage == 1) {
            require(isFanClubUser[_userId], "Invalid mint request from not fan club user");
        } else if (stage == 2) {
            require(isWhitelisted[_userId], "Invalid mint request from not whitelisted user");
        }
        require(!hasUserMinted[_userId], "This user has already minted a token");
        require(msg.value == price, "Insufficient price");
        require(nextTokenId < maxSupply + 1, "No available tokens");

        _safeMint(msg.sender, nextTokenId);
        hasUserMinted[_userId] = true;

        emit Minted(msg.sender, _userId, nextTokenId);

        nextTokenId += 1;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply > nextTokenId, "Invalid maxSupply updating request");

        maxSupply = _maxSupply;
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

    function setStage(uint256 _stage, uint256 _price) external onlyOwner {
        require(_stage < 4 && _stage > 0 && _stage > stage, "Invalid stage");

        stage = _stage;
        price = _price;
    }

    function setAllowListFanClubUsers(uint256[] memory _allowListFanClubUsers) external onlyOwner {
        for (uint256 i = 0; i < _allowListFanClubUsers.length; i++) {
            isFanClubUser[_allowListFanClubUsers[i]] = true;
        }
    }

    function setAllowListWhiteListUsers(uint256[] memory _allowListWhiteListUsers) external onlyOwner {
        for (uint256 i = 0; i < _allowListWhiteListUsers.length; i++) {
            isWhitelisted[_allowListWhiteListUsers[i]] = true;
        }
    }

    function totalBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId - 1;
    }

    function withdraw() external onlyOwner nonReentrant {
        require(
            address(this).balance > 0 && primaryWallet != address(0),
            "No funds to withdraw, or invalid wallet address to send."
        );

        payable(primaryWallet).transfer(address(this).balance);

        address payable to = payable(msg.sender);
        require(to != address(0), "Invalid recipient address");
        AddressUpgradeable.sendValue(to, address(this).balance);
    }
}
