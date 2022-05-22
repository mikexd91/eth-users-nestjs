import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { UserRegistrationDTO, UserRegistrationResponseDTO } from './dto/user-register.dto';
import { ConfigService } from '@nestjs/config';
import { UserRetrievalDTO, UserRetrievalResponseDTO } from './dto/user-retrieval.dto';
const Web3 = require('web3')
const Accounts = require('web3-eth-accounts');

@Injectable()
export class UsersService {
   constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
   ) {}

   async registerUser(userRequest: UserRegistrationDTO): Promise<UserRegistrationResponseDTO> {
    const { username, password } = userRequest
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    var accounts = new Accounts(this.configService.get('RPC_URL'));
    var account = accounts.create(hashedPassword);
    const user = await this.userRepository.create({
        username,
        password: hashedPassword,
        address: account.address,
        ethBalance: "0",
        linkBalance: "0"
    });

    try {
        const userResult = await this.userRepository.save(user);
        delete userResult.password
        delete userResult.linkBalance
        delete userResult.ethBalance
        const result = { ...userResult, privateKey: account.privateKey}
        return result
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('Username already exist');
        } else {
          throw new InternalServerErrorException();
        }
      }
   }

   async fetchUser(user: UserRetrievalDTO): Promise<UserRetrievalResponseDTO> {
    const userResult =  await this.userRepository.findOne({
        where: { id: user.id },
    });
    delete userResult.linkBalance
    delete userResult.ethBalance

    var web3 = new Web3(this.configService.get('RPC_URL'));
    let tokenAddress = this.configService.get('CHAINLINK_ADDRESS');
    let walletAddress = userResult.address

    // The minimum ABI required to get the ERC20 Token balance
    const minABI = [
        // balanceOf
        {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
        },
    ];
    // Get ERC20 Token contract instance
    const contract = new web3.eth.Contract(minABI, tokenAddress);
    const balance = await contract.methods.balanceOf(walletAddress).call(); 
    const linkBalance = web3.utils.fromWei(balance); 

    // Get Eth address
    let ethBalance = await web3.eth.getBalance(userResult.address)
    ethBalance = web3.utils.fromWei(ethBalance);

    this.userRepository.update(user.id, { ethBalance, linkBalance});

    const result = { ...userResult, balance: { etheruem: ethBalance, chainlink: linkBalance}}

    return result
   }

   async fetchAllUsers(): Promise<UserRetrievalResponseDTO[]> {
    const query = this.userRepository.createQueryBuilder('users');
    const userResults = await query
    //   .leftJoinAndSelect('organisation.rooms', 'rooms')
      .getMany();
    return userResults
   }
}
