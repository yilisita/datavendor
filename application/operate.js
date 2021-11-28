

const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const {buildCAClient, registerAndEnrollUser, enrollAdmin} = require('./CAUtil.js');


// 通道名
const channel = "mychannel";
// 链码名
const chaincode = "private";

const org1 = 'Org1MSP';
const org2 = 'Org2MSP';

async function initOrg1(username){

    // 通过终端获取用户姓名，并以这个用户姓名登录
    

    // load the network configuration for org2
    let connectionProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml'), 'utf8'));


    // Create a new CA client for interacting with the CA.
    const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // Create a new file system based wallet for managing identities.  path.join(__dirname, '../identity/admin/wallet')
    const walletPath = path.join(__dirname, '../identity/org1/wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // enroll an admin
    await enrollAdmin(ca, wallet, 'Org1MSP');

    // register and enroll a user
    await registerAndEnrollUser(ca, wallet, 'Org1MSP', username, 'org1.department1');

    // console.log('Successfully enrolled client user', username, 'and imported it into the wallet');
    // 新建gateway
    const gateway = new Gateway();
    // 利用配置文件连接到gateway
    await gateway.connect(connectionProfile,
        {wallet: wallet, identity: username, discovery: {enabled: true, asLocalhost: true}});
    
    // console.log("hello, ", username);
    const network = await gateway.getNetwork(channel);
    
    const contract = await network.getContract(chaincode);
    
    // 获取私有数据
    contract.addDiscoveryInterest({ name: 'private', collectionNames: ["Org1PrivateCollection"]});
    contract.addDiscoveryInterest({ name: 'private', collectionNames: ["Org2PrivateCollection"]});
    
    return contract;
}


// 需要背书
async function create(contract, username, userID, amount){
    try{
        var transaction = contract.createTransaction('CreateMyAsset');
        transaction.setEndorsingOrganizations(org1);
        await transaction.submit(username, userID, amount);
        return "新增记录 " + userID + " 成功！";
    }catch(error){
        return error;
    }
}


// 需要背书
async function update(contract, username, userID, amount){
    try{Update
        var transaction = contract.createTransaction('UpdateMyAsset');
        transaction.setEndorsingOrganizations(org1);
        await transaction.submit(username, userID, amount);
        return "记录 " + userID + " 更新成功!";
    }catch(error){
        return error;
    }
}

async function read(contract, userID){
    try{
        var res = await contract.evaluateTransaction('ReadMyAsset',userID);
        return res.toString();
    }catch(error){
        return error;
    }
}

async function readAll(contract){
    try{
        var res = await contract.evaluateTransaction('ReadMyAllAssets');
        return res.toString();
    }catch(error){
        return error;
    }
}

async function readRequest(contract){
    try{
        var res = await contract.evaluateTransaction("ReadRequest");
        return res.toString();
    }catch(error){
        return error;
    }
}

// 需要背书
async function handle(contract){
    try{
        //var res = await contract.evaluateTransaction('HandleRequest');
        //var resStr = res.toString();
        var transaction_0 = contract.createTransaction('HandleRequest');
        transaction_0.setEndorsingOrganizations(org1);
        var res = await transaction_0.submit();
        var resStr = res.toString();

        if (resStr == ''){
            return "没有需要处理的请求";
        }

        var transaction = contract.createTransaction('SendResponse');
        transaction.setEndorsingOrganizations(org2);
        await transaction.submit(resStr);

        return res.toString();

        return res.toString();
    }catch(err){
       return err;
    }
}

module.exports = {
    initOrg1,
    create,
    read,
    readAll,
    readRequest,
    handle,
    update,
}
