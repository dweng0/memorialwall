import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import * as hre from 'hardhat';
import {NewMemoryMessageEventObject} from '../typechain-types/MemorialWall';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("MemorialWall", function () {
    let memorialWall: Contract;
    const tip = { value: ethers.utils.parseEther("1")}
    let owner: SignerWithAddress;
    let userOne: SignerWithAddress;
    let userTwo: SignerWithAddress;
    let userThree: SignerWithAddress;
    
    beforeEach(async function () {
        const [localOwner, localUserOne, localUserTwo, localUserThree] = await ethers.getSigners();
        owner = localOwner;
        userOne = localUserOne;
        userTwo = localUserTwo;
        userThree = localUserThree;
        const MemorialWall = await hre.ethers.getContractFactory('MemorialWall');
        memorialWall = await MemorialWall.deploy();        
    });

    it('Should allow you to add a memory to the wall', async () => {
        await memorialWall.connect(userOne).addMemory('Hello World', 'jimmy test','ipfs_image_hash', tip);
        const memories: NewMemoryMessageEventObject[] = await memorialWall.getMemories();
        expect(memories && memories[0] && memories[0].message).to.equal('Hello World');
    });

    it('Be able to fetch memories from the wall', async () => {
        await memorialWall.connect(userOne).addMemory("Love you sausage", "timmy",'ipfs_image_hash', tip);
        await memorialWall.connect(userTwo).addMemory("Never forget you", "Katie",'ipfs_image_hash', tip);
        await memorialWall.connect(userThree).addMemory("Apple of my eye", "jimmy",'ipfs_image_hash', tip);
        const memories: NewMemoryMessageEventObject[] = await memorialWall.getMemories();
        expect(memories && memories.length > 0 && memories[2].message).to.equal("Apple of my eye");        
    });

    it('Be able to withdraw donations from the wall if you are the contract owner', async () => {
        const [owner] = await hre.ethers.getSigners();
        await memorialWall.connect(userOne).addMemory('Hello World', 'jimmy','ipfs_image_hash',tip);
        await memorialWall.connect(userTwo).addMemory('Hello World 2', 'timmy','ipfs_image_hash',tip);
        await memorialWall.connect(userThree).addMemory('Hello World 3', 'limmy', 'ipfs_image_hash', tip);
        const balanceBefore = await owner.getBalance();
        await memorialWall.connect(owner).withdrawDonations();
        const balanceAfter = await owner.getBalance();
        expect(balanceBefore).to.be.lt(balanceAfter);
    });

    it('Should fail to withdraw if the connected user is not the owner', async () => {
        const [owner, userOne] = await hre.ethers.getSigners();
        await memorialWall.addMemory('Hello World', 'bobby', 'ipfs_image_hash', tip);
        expect(() => memorialWall.connect(userOne).withdrawDonations()).to.throw;
        expect(() => memorialWall.connect(owner).withdrawDonations());
    });

    it('should prompt you to donate when adding to the wall', async () => {
        await expect(
            memorialWall.connect(userOne).addMemory('Hello World', 'jimmy', 'ipfs_image_hash', { value: 0 }))
            .to
            .be
            .revertedWith('You must donate to add a memory to the wall');
    });

    it('Should let you change owner if you are the owner', async () => {        
        await memorialWall.connect(owner).changeOwner(userOne.address);
        expect(await memorialWall.getOwner()).to.equal(userOne.address);
    });

    it('Should not let you change owner if you are not the owner', async () => {
        await expect(memorialWall.connect(userOne).changeOwner(userTwo.address)).to.be.revertedWith('Only the owner can change ownership');
    });

    it('Should return the owner address', async () => {
        expect(await memorialWall.getOwner()).to.equal(owner.address);
    });

    it('Should fail if the you withdraw donations and you are not the owner', async () => {
        await expect(memorialWall.connect(userOne).withdrawDonations()).to.be.revertedWith('Only the owner can withdraw donations');
    });
    
    it('Should show the balance of the contract', async () => {
        expect(await memorialWall.getDonationPot()).to.equal(0);
    });

});