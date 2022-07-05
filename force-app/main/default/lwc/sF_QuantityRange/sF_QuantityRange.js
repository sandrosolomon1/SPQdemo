import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getQuantityRangesByPLIsId from '@salesforce/apex/SF_LightningHelper.getQuantityRangesByPLIsId'; 
import upsertQuantityRanges from '@salesforce/apex/SF_LightningHelper.upsertQuantityRanges'; 

const FIELDS = {
    QUANTITY_FROM : "Quantity_From__c",
    PRICE : "Price__c",
    QUANTITY_TO : "Quantity_To__c",
    PRICE_LIST_ITEM : "Price_List_Item__c" 
}

export default class SF_QuantityRange extends LightningElement {
    @api recordId;
    @track priceRanges=[];
    quantityFrom=0;
    quantityTo=0;
    price=0; 
    loading=true;
    previousSelectedRecord=[];
    inputs = {
        "Quantity_From__c" : null,
        "Price__c" : null,
        "Quantity_To__c" : null,
        "Price_List_Item__c" : null 
    }; 

    @wire(getQuantityRangesByPLIsId, { pliId: '$recordId' }) 
    wired({error,data}) {
        if(data) {
            data.forEach(e => { 
                this.priceRanges.push({...e});
            })
            this.loading = false;
        }
    }

    setQuantityFrom(e) {
        this.quantityFrom = parseInt(e.target.value);
    }

    setQuantityTo(e) { 
        this.quantityTo = parseInt(e.target.value);
    }
 
    setPrice(e) { 
        this.price = parseInt(e.target.value);
    }

    handleSave() { 
        upsertQuantityRanges({ qrs: this.priceRanges, pliId: this.recordId }) 
            .then(() => { 
                this.dispatchEvent(  
                    new ShowToastEvent({
                        title: 'Success',
                        message: `Records are updated`, 
                        variant: 'success', 
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: error.body.message,
                        message: error.body.output.errors[0].message, 
                        variant: 'error',  
                    }),
                );  
            })
    }

    handleRecordUpdate(e) {  
        const index = e.currentTarget.dataset.id;
        
        this.template.querySelectorAll(`[data-id="${index}"]`).forEach((el,idx) => {
            if(idx > 3) { 
                return;
            } else if(el.readOnly) {
                if(this.previousSelectedRecord[idx] !== undefined && this.previousSelectedRecord[idx] !== el) {
                    this.previousSelectedRecord[idx].readOnly = true;
                    this.trackPrevInputUpdate = true;
                } 
                el.readOnly = false;
                this.previousSelectedRecord[idx] = el;  
                this.inputs[el.name] = el.value;
            } else { 
                el.readOnly = true;  
            }
        }); 
    }

    handleRecordFieldUpdate(e) { 
        if(e.target.name === FIELDS.QUANTITY_FROM && parseInt(e.target.value) >= this.inputs[FIELDS.QUANTITY_TO]) {
            // 
        }
        this.priceRanges[e.currentTarget.dataset.id][e.target.name] = parseInt(e.target.value); 
    }

    handleDelete(e) {
        this.priceRanges.splice(e.currentTarget.dataset.id, 1);
    }

    handleAdd() {
        if(this.quantityFrom !== 0 && this.quantityTo !== 0 && this.price !== 0) {
            if(this.quantityFrom >= this.quantityTo) {
               this.dispatchEvent( 
                 new ShowToastEvent({
                     title: 'Error while adding item',
                     message: 'Quantity From can not be greater than or equal to Quantity To', 
                     variant: 'error', 
                 }),
               );  
               return;
            }
            this.inputs.Quantity_From__c = this.quantityFrom;
            this.inputs.Quantity_To__c = this.quantityTo;
            this.inputs.Price__c = this.price;     
            this.inputs.Price_List_Item__c = this.recordId;       
            this.priceRanges.push({...this.inputs});
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Can not add item',
                    message: `Input fields were left blank`, 
                    variant: 'error', 
                }),
            );
        }
    }
}