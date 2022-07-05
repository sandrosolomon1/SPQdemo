declare module "@salesforce/apex/SF_LightningHelper.createQuote" {
  export default function createQuote(param: {accountId: any, name: any, opportunityId: any, priceListId: any, expirationDate: any, primary: any, status: any}): Promise<any>;
}
declare module "@salesforce/apex/SF_LightningHelper.cloneQuote" {
  export default function cloneQuote(param: {quoteId: any, wihtQuoteLineItems: any}): Promise<any>;
}
declare module "@salesforce/apex/SF_LightningHelper.getQuantityRangesByPLIsId" {
  export default function getQuantityRangesByPLIsId(param: {pliId: any}): Promise<any>;
}
declare module "@salesforce/apex/SF_LightningHelper.upsertQuantityRanges" {
  export default function upsertQuantityRanges(param: {qrs: any, pliId: any}): Promise<any>;
}
