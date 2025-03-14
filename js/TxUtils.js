function destinationsToAmount(destinations){
    // Gets amount from destinations line
    // input: "20.000000000000: 9tLGyK277MnYrDc7Vzi6TB1pJvstFoviziFwsqQNFbwA9rvg5RxYVYjEezFKDjvDHgAzTELJhJHVx6JAaWZKeVqSUZkXeKk"
    // returns: 20.000000000000
    return destinations.split(" ")[0].split(":")[0];
}

function destinationsToAddress(destinations){
    var address = destinations.split(" ")[1];
    if(address === undefined) return ""
    return address;
}

function addressTruncate(address, range){
    if(typeof(address) === "undefined") return "";
    if(typeof(range) === "undefined") range = 8;
    return address.substring(0, range) + "..." + address.substring(address.length-range);
}

function addressTruncatePretty(address, blocks){
    if(typeof(address) === "undefined") return "";
    if(typeof(blocks) === "undefined") blocks = 2;
    blocks = blocks <= 1 ? 1 : blocks >= 23 ? 23 : blocks;
    var ret = "";
    return address.substring(0, 4 * blocks).match(/.{1,4}/g).join(' ') + " .. " + address.substring(address.length - 4 * blocks).match(/.{1,4}/g).join(' ');
}

function check256(str, length) {
    if (str.length != length)
        return false;
    for (var i = 0; i < length; ++i) {
        if (str[i] >= '0' && str[i] <= '9')
            continue;
        if (str[i] >= 'a' && str[i] <= 'z')
            continue;
        if (str[i] >= 'A' && str[i] <= 'Z')
            continue;
        return false;
    }
    return true;
}

function checkAddress(address, testnet) {
  return walletManager.addressValid(address, testnet)
}

function checkTxID(txid) {
    return check256(txid, 64)
}

function checkSignature(signature) {
    if (signature.indexOf("OutProofV") === 0) {
        if ((signature.length - 10) % 132 != 0)
            return false;
        return check256(signature, signature.length);
    } else if (signature.indexOf("InProofV") === 0) {
        if ((signature.length - 9) % 132 != 0)
            return false;
        return check256(signature, signature.length);
    } else if (signature.indexOf("SpendProofV") === 0) {
        if ((signature.length - 12) % 88 != 0)
            return false;
        return check256(signature, signature.length);
    }
    return false;
}

function isValidOpenAliasAddress(address) {
    address = address.trim()
    var dot = address.indexOf('.')
    if (dot < 0)
        return false
    // we can get an awful lot of valid domains, including non ASCII chars... accept anything
    return true
}

function makeQRCodeString(addr, amount, txDescription, recipientName) {
    var XMR_URI_SCHEME = "monero:"
    var XMR_AMOUNT = "tx_amount"
    var XMR_RECIPIENT_NAME = "recipient_name"
    var XMR_TX_DESCRIPTION = "tx_description"
    var qrCodeString =""
    qrCodeString += (XMR_URI_SCHEME + addr)
    if (amount !== undefined && amount !== ""){
      qrCodeString += ("?" + XMR_AMOUNT + "=" + amount)
    }
    if (txDescription !== undefined && txDescription !== ""){
        if (amount == ""){
            qrCodeString += ("?" + XMR_TX_DESCRIPTION + "=" + encodeURI(txDescription))
        } else {
            qrCodeString += ("&" + XMR_TX_DESCRIPTION + "=" + encodeURI(txDescription))
        }
    }
    if (recipientName !== undefined && recipientName !== ""){
        if (amount == "" && txDescription == ""){
            qrCodeString += ("?" + XMR_RECIPIENT_NAME + "=" + encodeURI(recipientName))
        } else {
            qrCodeString += ("&" + XMR_RECIPIENT_NAME + "=" + encodeURI(recipientName))
        }
    }
    return qrCodeString
}
