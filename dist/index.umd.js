(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('io-ts'), require('@faast/ts-common'), require('request-promise-native'), require('qs'), require('util')) :
  typeof define === 'function' && define.amd ? define(['exports', 'io-ts', '@faast/ts-common', 'request-promise-native', 'qs', 'util'], factory) :
  (global = global || self, factory(global.blockbookClient = {}, global.t, global.tsCommon, global.request, global.qs, global.util));
}(this, (function (exports, t, tsCommon, request, qs, util) { 'use strict';

  request = request && request.hasOwnProperty('default') ? request['default'] : request;
  qs = qs && qs.hasOwnProperty('default') ? qs['default'] : qs;

  const Paginated = t.type({
      page: t.number,
      totalPages: t.number,
      itemsOnPage: t.number,
  }, 'Paginated');
  const BlockbookConfig = tsCommon.requiredOptionalCodec({
      nodes: t.array(t.string),
  }, {
      disableTypeValidation: t.boolean,
  }, 'BlockbookConfig');
  const BlockbookInfo = t.type({
      coin: t.string,
      host: t.string,
      version: t.string,
      gitCommit: t.string,
      buildTime: t.string,
      syncMode: t.boolean,
      initialSync: t.boolean,
      inSync: t.boolean,
      bestHeight: t.number,
      lastBlockTime: t.string,
      inSyncMempool: t.boolean,
      lastMempoolTime: t.string,
      mempoolSize: t.number,
      decimals: t.number,
      dbSize: t.number,
      about: t.string,
  }, 'BlockbookInfo');
  const BackendInfo = tsCommon.requiredOptionalCodec({
      chain: t.string,
      blocks: t.number,
      bestBlockHash: t.string,
      difficulty: t.string,
      version: t.string,
  }, {
      protocolVersion: t.string,
      subversion: t.string,
      sizeOnDisk: t.number,
      headers: t.number,
      timeOffset: t.number,
      warnings: t.string,
  }, 'BackendInfo');
  const SystemInfo = t.type({
      blockbook: BlockbookInfo,
      backend: BackendInfo,
  }, 'ApiStatus');
  const BlockHashResponse = t.type({
      blockHash: t.string,
  }, 'BlockHashResponse');
  const NormalizedTxCommonVin = tsCommon.requiredOptionalCodec({
      n: t.number,
  }, {
      txid: t.string,
      vout: t.number,
      sequence: t.number,
      addresses: t.array(t.string),
      value: t.string,
      hex: t.string,
      asm: t.string,
      coinbase: t.string,
      isAddress: t.boolean,
  }, 'NormalizedTxCommonVin');
  const NormalizedTxCommonVout = tsCommon.requiredOptionalCodec({
      n: t.number,
      addresses: t.array(t.string),
  }, {
      value: t.string,
      spent: t.boolean,
      spentTxId: t.string,
      spentIndex: t.number,
      spentHeight: t.number,
      hex: t.string,
      asm: t.string,
      type: t.string,
      isAddress: t.boolean,
  }, 'NormalizedTxCommonVout');
  const EthereumSpecific = t.type({
      status: t.number,
      nonce: t.number,
      gasLimit: t.number,
      gasUsed: t.number,
      gasPrice: t.string,
  }, 'EthereumSpecific');
  const TokenTransfer = t.type({
      type: t.string,
      from: t.string,
      to: t.string,
      token: t.string,
      name: t.string,
      symbol: t.string,
      decimals: t.number,
      value: t.string,
  }, 'TokenTransfer');
  const NormalizedTxCommon = tsCommon.requiredOptionalCodec({
      txid: t.string,
      vin: t.array(NormalizedTxCommonVin),
      vout: t.array(NormalizedTxCommonVout),
      blockHeight: t.number,
      confirmations: t.number,
      blockTime: t.number,
      value: t.string,
  }, {
      version: t.number,
      lockTime: t.number,
      blockHash: t.string,
      size: t.number,
      valueIn: t.string,
      fees: t.string,
      hex: t.string,
      tokenTransfers: t.array(TokenTransfer),
      ethereumSpecific: EthereumSpecific,
  }, 'NormalizedTxCommon');
  const GetAddressDetailsLevels = t.keyof({
      basic: null,
      tokens: null,
      tokenBalances: null,
      txids: null,
      txs: null,
  });
  const GetAddressDetailsOptions = t.partial({
      page: t.number,
      pageSize: t.number,
      from: t.number,
      to: t.number,
      details: GetAddressDetailsLevels,
  });
  const TokenDetailsTypeERC20 = t.literal('ERC20');
  const TokenDetailsTypeXpubAddress = t.literal('XPUBAddress');
  const TokenDetailsType = t.union([
      TokenDetailsTypeERC20,
      TokenDetailsTypeXpubAddress,
  ], 'TokenDetailsType');
  const TokenDetailsCommon = tsCommon.requiredOptionalCodec({
      type: TokenDetailsType,
      name: t.string,
      transfers: t.number,
  }, {
      path: t.string,
      contract: t.string,
      symbol: t.string,
      decimals: t.number,
      balance: t.string,
      totalReceived: t.string,
      totalSent: t.string,
  }, 'TokenDetailsCommon');
  const TokenDetailsCommonBalance = tsCommon.extendCodec(TokenDetailsCommon, {
      balance: t.string,
  }, 'TokenDetailsCommonBalance');
  const AddressDetailsCommonBasic = tsCommon.requiredOptionalCodec({
      address: t.string,
      balance: t.string,
      unconfirmedBalance: t.string,
      unconfirmedTxs: t.number,
      txs: t.number,
  }, {
      totalReceived: t.string,
      totalSent: t.string,
      nonTokenTxs: t.number,
      nonce: t.string,
      usedTokens: t.number,
      erc20Contract: t.any,
  }, 'AddressDetailsCommonBasic');
  const AddressDetailsCommonTokens = tsCommon.extendCodec(AddressDetailsCommonBasic, {
      tokens: t.array(TokenDetailsCommon),
  }, 'AddressDetailsCommonTokens');
  const AddressDetailsCommonTokenBalances = tsCommon.extendCodec(AddressDetailsCommonBasic, {}, {
      tokens: t.array(TokenDetailsCommonBalance),
  }, 'AddressDetailsCommonTokenBalances');
  const AddressDetailsCommonTxids = tsCommon.extendCodec(AddressDetailsCommonTokenBalances, Paginated.props, {
      txids: t.array(t.string),
  }, 'AddressDetailsCommonTxids');
  const AddressDetailsCommonTxs = tsCommon.extendCodec(AddressDetailsCommonTokenBalances, Paginated.props, {
      txs: t.array(NormalizedTxCommon),
  }, 'AddressDetailsCommonTxs');
  const GetUtxosOptions = t.partial({
      confirmed: t.boolean,
  }, 'GetUtxosOptions');
  const UtxoDetails = tsCommon.requiredOptionalCodec({
      txid: t.string,
      vout: t.number,
      value: t.string,
      confirmations: t.number,
  }, {
      height: t.number,
      coinbase: t.boolean,
      lockTime: t.number,
  }, 'UtxoDetails');
  const UtxoDetailsXpub = tsCommon.extendCodec(UtxoDetails, {}, {
      address: t.string,
      path: t.string,
  }, 'UtxoDetailsXpub');
  const BlockInfoCommon = tsCommon.requiredOptionalCodec({
      ...Paginated.props,
      hash: t.string,
      height: t.number,
      confirmations: t.number,
      size: t.number,
      version: t.number,
      merkleRoot: t.string,
      nonce: t.string,
      bits: t.string,
      difficulty: t.string,
      txCount: t.number,
  }, {
      previousBlockHash: t.string,
      nextBlockHash: t.string,
      time: t.number,
      txs: t.array(NormalizedTxCommon),
  }, 'BlockInfoCommon');
  const SendTxSuccess = t.type({
      result: t.string,
  }, 'SendTransactionSuccess');
  const SendTxError = t.type({
      error: t.type({
          message: t.string,
      })
  }, 'SendTxFailed');

  const NormalizedTxBitcoinVin = tsCommon.extendCodec(NormalizedTxCommonVin, {
      value: t.string,
  }, 'NormalizedTxBitcoinVin');
  const NormalizedTxBitcoinVout = tsCommon.extendCodec(NormalizedTxCommonVout, {
      value: t.string,
  }, 'NormalizedTxBitcoinVout');
  const NormalizedTxBitcoin = tsCommon.extendCodec(NormalizedTxCommon, {
      vin: t.array(NormalizedTxBitcoinVin),
      vout: t.array(NormalizedTxBitcoinVout),
      valueIn: t.string,
      fees: t.string,
  }, 'NormalizedTxBitcoin');
  const SpecificTxBitcoinVinScriptSig = t.type({
      asm: t.string,
      hex: t.string,
  }, 'SpecificTxBitcoinVinScriptSig');
  const SpecificTxBitcoinVin = t.type({
      txid: t.string,
      vout: t.number,
      scriptSig: SpecificTxBitcoinVinScriptSig,
      sequence: t.number
  }, 'SpecificTxBitcoinVin');
  const SpecificTxBitcoinVoutScriptPubKey = t.type({
      asm: t.string,
      hex: t.string,
      reqSigs: t.number,
      type: t.string,
      addresses: t.array(t.string),
  }, 'SpecificTxBitcoinVoutScriptPubKey');
  const SpecificTxBitcoinVout = t.type({
      value: t.number,
      n: t.number,
      scriptPubKey: SpecificTxBitcoinVoutScriptPubKey,
  }, 'SpecificTxBitcoinVout');
  const SpecificTxBitcoin = t.type({
      txid: t.string,
      hash: t.string,
      version: t.number,
      size: t.number,
      vsize: t.number,
      weight: t.number,
      locktime: t.number,
      vin: t.array(SpecificTxBitcoinVin),
      vout: t.array(SpecificTxBitcoinVout),
      hex: t.string,
      blockhash: t.string,
      confirmations: t.number,
      time: t.number,
      blocktime: t.number,
  }, 'SpecificTxBitcoin');
  const AddressDetailsBitcoinBasic = tsCommon.extendCodec(AddressDetailsCommonBasic, {
      totalReceived: t.string,
      totalSent: t.string,
  }, 'AddressDetailsBitcoinBasic');
  const AddressDetailsBitcoinTokens = AddressDetailsBitcoinBasic;
  const AddressDetailsBitcoinTokenBalances = AddressDetailsBitcoinBasic;
  const AddressDetailsBitcoinTxids = tsCommon.extendCodec(AddressDetailsBitcoinTokenBalances, Paginated.props, {
      txids: t.array(t.string),
  }, 'AddressDetailsBitcoinTxids');
  const AddressDetailsBitcoinTxs = tsCommon.extendCodec(AddressDetailsBitcoinTokenBalances, Paginated.props, {
      transactions: t.array(NormalizedTxBitcoin),
  }, 'AddressDetailsBitcoinTxs');
  const GetXpubDetailsTokensOption = t.keyof({
      nonzero: null,
      used: null,
      derived: null,
  }, 'GetXpubDetailsTokensOption');
  const GetXpubDetailsOptions = tsCommon.extendCodec(GetAddressDetailsOptions, {}, {
      usedTokens: t.number,
      tokens: GetXpubDetailsTokensOption,
  }, 'GetXpubDetailsOptions');
  const TokenDetailsXpubAddress = t.type({
      type: TokenDetailsTypeXpubAddress,
      name: t.string,
      path: t.string,
      transfers: t.number,
      decimals: t.number,
      balance: t.string,
      totalReceived: t.string,
      totalSent: t.string,
  }, 'TokenDetailsXpubAddress');
  const TokenDetailsXpubAddressBalance = tsCommon.extendCodec(TokenDetailsXpubAddress, {
      balance: t.string,
  }, 'TokenDetailsXpubAddressBalance');
  const XpubDetailsBasic = AddressDetailsBitcoinBasic;
  const XpubDetailsTokens = tsCommon.extendCodec(XpubDetailsBasic, {}, {
      tokens: TokenDetailsXpubAddress,
  }, 'XpubDetailsTokens');
  const XpubDetailsTokenBalances = tsCommon.extendCodec(XpubDetailsBasic, {}, {
      tokens: TokenDetailsXpubAddressBalance,
  }, 'XpubDetailsTokenBalances');
  const XpubDetailsTxids = tsCommon.extendCodec(XpubDetailsTokenBalances, Paginated.props, {
      txids: t.array(t.string),
  }, 'XpubDetailsTxids');
  const XpubDetailsTxs = tsCommon.extendCodec(XpubDetailsTokenBalances, Paginated.props, {
      transactions: t.array(NormalizedTxBitcoin),
  }, 'XpubDetailsTxs');
  const BlockInfoBitcoin = tsCommon.extendCodec(BlockInfoCommon, {}, {
      txs: t.array(NormalizedTxBitcoin),
  }, 'BlockInfoBitcoin');

  const NormalizedTxEthereumVin = tsCommon.extendCodec(NormalizedTxCommonVin, {
      addresses: t.array(t.string),
  }, 'NormalizedTxEthereumVin');
  const NormalizedTxEthereumVout = tsCommon.extendCodec(NormalizedTxCommonVout, {
      value: t.string,
  }, 'NormalizedTxEthereumVout');
  const NormalizedTxEthereum = tsCommon.extendCodec(NormalizedTxCommon, {
      vin: t.array(NormalizedTxEthereumVin),
      vout: t.array(NormalizedTxEthereumVout),
      fees: t.string,
      ethereumSpecific: EthereumSpecific,
  }, 'NormalizedTxEthereum');
  const SpecificTxEthereumTx = t.type({
      nonce: t.string,
      gasPrice: t.string,
      gas: t.string,
      to: t.string,
      value: t.string,
      input: t.string,
      hash: t.string,
      blockNumber: t.string,
      blockHash: t.string,
      from: t.string,
      transactionIndex: t.string,
  }, 'SpecificTxEthereumTx');
  const SpecificTxEthereumReceipt = t.type({
      gasUsed: t.string,
      status: t.string,
      logs: t.array(t.any),
  }, 'SpecificTxEthereumReceipt');
  const SpecificTxEthereum = t.type({
      tx: SpecificTxEthereumTx,
      receipt: SpecificTxEthereumReceipt,
  }, 'SpecificTxEthereum');
  const TokenDetailsERC20 = t.type({
      type: TokenDetailsTypeERC20,
      name: t.string,
      contract: t.string,
      transfers: t.number,
      symbol: t.string,
  }, 'TokenDetailsERC20');
  const TokenDetailsERC20Balance = tsCommon.extendCodec(TokenDetailsERC20, {
      balance: t.string,
  }, 'TokenDetailsERC20Balance');
  const AddressDetailsEthereumBasic = tsCommon.extendCodec(AddressDetailsCommonBasic, {
      nonTokenTxs: t.number,
      nonce: t.string,
  }, 'AddressDetailsEthereumBasic');
  const AddressDetailsEthereumTokens = tsCommon.extendCodec(AddressDetailsEthereumBasic, {}, {
      tokens: TokenDetailsERC20,
  }, 'AddressDetailsEthereumTokens');
  const AddressDetailsEthereumTokenBalances = tsCommon.extendCodec(AddressDetailsEthereumBasic, {}, {
      tokens: TokenDetailsERC20Balance,
  }, 'AddressDetailsEthereumTokenBalances');
  const AddressDetailsEthereumTxids = tsCommon.extendCodec(AddressDetailsEthereumTokenBalances, Paginated.props, {
      txids: t.array(t.string),
  }, 'AddressDetailsEthereumTxids');
  const AddressDetailsEthereumTxs = tsCommon.extendCodec(AddressDetailsEthereumTokenBalances, Paginated.props, {
      transactions: t.array(NormalizedTxEthereum),
  }, 'AddressDetailsEthereumTxs');
  const BlockInfoEthereum = tsCommon.extendCodec(BlockInfoCommon, {}, {
      txs: t.array(NormalizedTxEthereum),
  }, 'BlockInfoEthereum');

  function RequestError(cause, options, response) {

      this.name = 'RequestError';
      this.message = String(cause);
      this.cause = cause;
      this.error = cause; // legacy attribute
      this.options = options;
      this.response = response;

      if (Error.captureStackTrace) { // required for non-V8 environments
          Error.captureStackTrace(this);
      }

  }
  RequestError.prototype = Object.create(Error.prototype);
  RequestError.prototype.constructor = RequestError;


  function StatusCodeError(statusCode, body, options, response) {

      this.name = 'StatusCodeError';
      this.statusCode = statusCode;
      this.message = statusCode + ' - ' + (JSON && JSON.stringify ? JSON.stringify(body) : body);
      this.error = body; // legacy attribute
      this.options = options;
      this.response = response;

      if (Error.captureStackTrace) { // required for non-V8 environments
          Error.captureStackTrace(this);
      }

  }
  StatusCodeError.prototype = Object.create(Error.prototype);
  StatusCodeError.prototype.constructor = StatusCodeError;


  function TransformError(cause, options, response) {

      this.name = 'TransformError';
      this.message = String(cause);
      this.cause = cause;
      this.error = cause; // legacy attribute
      this.options = options;
      this.response = response;

      if (Error.captureStackTrace) { // required for non-V8 environments
          Error.captureStackTrace(this);
      }

  }
  TransformError.prototype = Object.create(Error.prototype);
  TransformError.prototype.constructor = TransformError;


  var errors = {
      RequestError: RequestError,
      StatusCodeError: StatusCodeError,
      TransformError: TransformError
  };

  var errors$1 = errors;

  var errors$2 = errors$1;

  const xpubDetailsCodecs = {
      basic: XpubDetailsBasic,
      tokens: XpubDetailsTokens,
      tokenBalances: XpubDetailsTokenBalances,
      txids: XpubDetailsTxids,
      txs: XpubDetailsTxs,
  };
  class BaseBlockbook {
      constructor(config, normalizedTxCodec, specificTxCodec, blockInfoCodec, addressDetailsCodecs) {
          this.normalizedTxCodec = normalizedTxCodec;
          this.specificTxCodec = specificTxCodec;
          this.blockInfoCodec = blockInfoCodec;
          this.addressDetailsCodecs = addressDetailsCodecs;
          config = tsCommon.assertType(BlockbookConfig, config);
          this.nodes = config.nodes;
          if (this.nodes.length === 0) {
              throw new Error('Blockbook node list must not be empty');
          }
          this.disableTypeValidation = config.disableTypeValidation || false;
      }
      doAssertType(codec, value, ...rest) {
          if (this.disableTypeValidation) {
              return value;
          }
          return tsCommon.assertType(codec, value, ...rest);
      }
      async doRequest(method, url, params, body, options) {
          const node = this.nodes[0];
          try {
              return await request(`https://${node}${url}${params ? qs.stringify(params) : ''}`, {
                  method,
                  body,
                  json: true,
                  ...options,
              });
          }
          catch (e) {
              if (e instanceof errors$2.StatusCodeError) {
                  const body = e.response.body;
                  if (util.isObject(body) && body.error) {
                      if (tsCommon.isString(body.error)) {
                          throw new Error(body.error);
                      }
                      else if (util.isObject(body.error) && tsCommon.isString(body.error.message)) {
                          throw new Error(body.error.message);
                      }
                  }
              }
              throw e;
          }
      }
      async getStatus() {
          const response = await this.doRequest('GET', '/api/v2');
          return this.doAssertType(SystemInfo, response);
      }
      async getBlockHash(blockNumber) {
          const response = await this.doRequest('GET', `/api/v2/block-index/${blockNumber}`);
          const { blockHash } = this.doAssertType(BlockHashResponse, response);
          return blockHash;
      }
      async getTx(txid) {
          const response = await this.doRequest('GET', `/api/v2/tx/${txid}`);
          return this.doAssertType(this.normalizedTxCodec, response);
      }
      async getTxSpecific(txid) {
          const response = await this.doRequest('GET', `/api/v2/tx-specific/${txid}`);
          return this.doAssertType(this.specificTxCodec, response);
      }
      async getAddressDetails(address, options = {}) {
          const response = await this.doRequest('GET', `/api/v2/address/${address}`, options);
          const detailsLevel = options.details || 'txids';
          const codec = this.addressDetailsCodecs[detailsLevel];
          return this.doAssertType(codec, response);
      }
      async getXpubDetails(xpub, options = {}) {
          const response = await this.doRequest('GET', `/api/v2/xpub/${xpub}`, options);
          const detailsLevel = options.details || 'txids';
          const codec = xpubDetailsCodecs[detailsLevel];
          return this.doAssertType(codec, response);
      }
      async getUtxosForAddress(address, options = {}) {
          const response = await this.doRequest('GET', `/api/v2/utxo/${address}`, options);
          return this.doAssertType(t.array(UtxoDetails), response);
      }
      async getUtxosForXpub(xpub, options = {}) {
          const response = await this.doRequest('GET', `/api/v2/utxo/${xpub}`, options);
          return this.doAssertType(t.array(UtxoDetailsXpub), response);
      }
      async getBlock(block) {
          const response = await this.doRequest('GET', `/api/v2/block/${block}`);
          return this.doAssertType(this.blockInfoCodec, response);
      }
      async sendTx(txHex) {
          const response = await this.doRequest('GET', `/api/v2/sendtx/${txHex}`);
          if (SendTxError.is(response)) {
              throw new Error(`blockbook sendtx returned error: ${response.error.message}`);
          }
          else {
              return response.result;
          }
      }
  }

  class Blockbook extends BaseBlockbook {
      constructor(config) {
          super(config, NormalizedTxCommon, t.any, BlockInfoCommon, {
              basic: AddressDetailsCommonBasic,
              tokens: AddressDetailsCommonTokens,
              tokenBalances: AddressDetailsCommonTokenBalances,
              txids: AddressDetailsCommonTxids,
              txs: AddressDetailsCommonTxs,
          });
      }
  }

  class BlockbookBitcoin extends BaseBlockbook {
      constructor(config) {
          super(config, NormalizedTxBitcoin, SpecificTxBitcoin, BlockInfoBitcoin, {
              basic: AddressDetailsBitcoinBasic,
              tokens: AddressDetailsBitcoinTokens,
              tokenBalances: AddressDetailsBitcoinTokenBalances,
              txids: AddressDetailsBitcoinTxids,
              txs: AddressDetailsBitcoinTxs,
          });
      }
  }

  class BlockbookEthereum extends BaseBlockbook {
      constructor(config) {
          super(config, NormalizedTxEthereum, SpecificTxEthereum, BlockInfoEthereum, {
              basic: AddressDetailsEthereumBasic,
              tokens: AddressDetailsEthereumTokens,
              tokenBalances: AddressDetailsEthereumTokenBalances,
              txids: AddressDetailsEthereumTxids,
              txs: AddressDetailsEthereumTxs,
          });
      }
      async getXpubDetails() {
          throw new Error('BlockbookEthereum.getXpubDetails not supported');
      }
      async getUtxosForAddress() {
          throw new Error('BlockbookEthereum.getUtxosForAddress not supported');
      }
      async getUtxosForXpub() {
          throw new Error('BlockbookEthereum.getUtxosForXpub not supported');
      }
  }

  exports.AddressDetailsBitcoinBasic = AddressDetailsBitcoinBasic;
  exports.AddressDetailsBitcoinTokenBalances = AddressDetailsBitcoinTokenBalances;
  exports.AddressDetailsBitcoinTokens = AddressDetailsBitcoinTokens;
  exports.AddressDetailsBitcoinTxids = AddressDetailsBitcoinTxids;
  exports.AddressDetailsBitcoinTxs = AddressDetailsBitcoinTxs;
  exports.AddressDetailsCommonBasic = AddressDetailsCommonBasic;
  exports.AddressDetailsCommonTokenBalances = AddressDetailsCommonTokenBalances;
  exports.AddressDetailsCommonTokens = AddressDetailsCommonTokens;
  exports.AddressDetailsCommonTxids = AddressDetailsCommonTxids;
  exports.AddressDetailsCommonTxs = AddressDetailsCommonTxs;
  exports.AddressDetailsEthereumBasic = AddressDetailsEthereumBasic;
  exports.AddressDetailsEthereumTokenBalances = AddressDetailsEthereumTokenBalances;
  exports.AddressDetailsEthereumTokens = AddressDetailsEthereumTokens;
  exports.AddressDetailsEthereumTxids = AddressDetailsEthereumTxids;
  exports.AddressDetailsEthereumTxs = AddressDetailsEthereumTxs;
  exports.BackendInfo = BackendInfo;
  exports.BaseBlockbook = BaseBlockbook;
  exports.BlockHashResponse = BlockHashResponse;
  exports.BlockInfoBitcoin = BlockInfoBitcoin;
  exports.BlockInfoCommon = BlockInfoCommon;
  exports.BlockInfoEthereum = BlockInfoEthereum;
  exports.Blockbook = Blockbook;
  exports.BlockbookBitcoin = BlockbookBitcoin;
  exports.BlockbookConfig = BlockbookConfig;
  exports.BlockbookEthereum = BlockbookEthereum;
  exports.BlockbookInfo = BlockbookInfo;
  exports.EthereumSpecific = EthereumSpecific;
  exports.GetAddressDetailsLevels = GetAddressDetailsLevels;
  exports.GetAddressDetailsOptions = GetAddressDetailsOptions;
  exports.GetUtxosOptions = GetUtxosOptions;
  exports.GetXpubDetailsOptions = GetXpubDetailsOptions;
  exports.GetXpubDetailsTokensOption = GetXpubDetailsTokensOption;
  exports.NormalizedTxBitcoin = NormalizedTxBitcoin;
  exports.NormalizedTxBitcoinVin = NormalizedTxBitcoinVin;
  exports.NormalizedTxBitcoinVout = NormalizedTxBitcoinVout;
  exports.NormalizedTxCommon = NormalizedTxCommon;
  exports.NormalizedTxCommonVin = NormalizedTxCommonVin;
  exports.NormalizedTxCommonVout = NormalizedTxCommonVout;
  exports.NormalizedTxEthereum = NormalizedTxEthereum;
  exports.NormalizedTxEthereumVin = NormalizedTxEthereumVin;
  exports.NormalizedTxEthereumVout = NormalizedTxEthereumVout;
  exports.Paginated = Paginated;
  exports.SendTxError = SendTxError;
  exports.SendTxSuccess = SendTxSuccess;
  exports.SpecificTxBitcoin = SpecificTxBitcoin;
  exports.SpecificTxBitcoinVin = SpecificTxBitcoinVin;
  exports.SpecificTxBitcoinVinScriptSig = SpecificTxBitcoinVinScriptSig;
  exports.SpecificTxBitcoinVout = SpecificTxBitcoinVout;
  exports.SpecificTxBitcoinVoutScriptPubKey = SpecificTxBitcoinVoutScriptPubKey;
  exports.SpecificTxEthereum = SpecificTxEthereum;
  exports.SpecificTxEthereumReceipt = SpecificTxEthereumReceipt;
  exports.SpecificTxEthereumTx = SpecificTxEthereumTx;
  exports.SystemInfo = SystemInfo;
  exports.TokenDetailsCommon = TokenDetailsCommon;
  exports.TokenDetailsCommonBalance = TokenDetailsCommonBalance;
  exports.TokenDetailsERC20 = TokenDetailsERC20;
  exports.TokenDetailsERC20Balance = TokenDetailsERC20Balance;
  exports.TokenDetailsType = TokenDetailsType;
  exports.TokenDetailsTypeERC20 = TokenDetailsTypeERC20;
  exports.TokenDetailsTypeXpubAddress = TokenDetailsTypeXpubAddress;
  exports.TokenDetailsXpubAddress = TokenDetailsXpubAddress;
  exports.TokenDetailsXpubAddressBalance = TokenDetailsXpubAddressBalance;
  exports.TokenTransfer = TokenTransfer;
  exports.UtxoDetails = UtxoDetails;
  exports.UtxoDetailsXpub = UtxoDetailsXpub;
  exports.XpubDetailsBasic = XpubDetailsBasic;
  exports.XpubDetailsTokenBalances = XpubDetailsTokenBalances;
  exports.XpubDetailsTokens = XpubDetailsTokens;
  exports.XpubDetailsTxids = XpubDetailsTxids;
  exports.XpubDetailsTxs = XpubDetailsTxs;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map