//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract ProofOfKYC is Ownable, AccessControl, EIP712, ERC721 {
	using Counters for Counters.Counter;

	bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
	bytes32 private immutable _VERIFICATION_TYPEHASH = keccak256('Verification(address requester,bool allowed)');

	Counters.Counter private _tokenIds;

	constructor(address minter) ERC721('Proof of KYC', 'KYC') EIP712('Proof of KYC', '1') {
		_setupRole(MINTER_ROLE, minter);
	}

	function mint(bytes memory signature) external returns (uint256) {
		bytes32 structHash = keccak256(abi.encode(_VERIFICATION_TYPEHASH, _msgSender(), true));

		bytes32 hash = _hashTypedDataV4(structHash);

		address signer = ECDSA.recover(hash, signature);
		require(hasRole(MINTER_ROLE, signer), 'invalid signature');
		require(balanceOf(_msgSender()) == 0, 'user already has a token');

		_tokenIds.increment();

		uint256 tokenId = _tokenIds.current();

		_mint(_msgSender(), tokenId);

		return tokenId;
	}

	// solhint-disable-next-line no-unused-variables
	function approve(address, uint256) public pure override {
		revert('token is not transferrable');
	}

	function setApprovalForAll(address, bool) public pure override {
		revert('token is not transferrable');
	}

	function safeTransferFrom(
		address,
		address,
		uint256
	) public pure override {
		revert('token is not transferrable');
	}

	function safeTransferFrom(
		address,
		address,
		uint256,
		bytes memory
	) public pure override {
		revert('token is not transferrable');
	}

	function transferFrom(
		address,
		address,
		uint256
	) public pure override {
		revert('token is not transferrable');
	}

	function approveMinter(address minter) external onlyOwner {
		_setupRole(MINTER_ROLE, minter);
	}

	function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
