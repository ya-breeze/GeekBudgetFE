/**
 * Geek Budget - OpenAPI 3.0
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: ilya.korolev@outlook.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Movement } from './movement';


export interface Transaction { 
    id: string;
    date: string;
    description?: string;
    place?: string;
    tags?: Array<string>;
    partnerName?: string;
    partnerAccount?: string;
    /**
     * Internal bank\'s ID to be able to match later if necessary
     */
    partnerInternalId?: string;
    /**
     * Stores extra data about transaction. For example could hold \"variable symbol\" to distinguish payment for the same account, but with different meaning
     */
    extra?: string;
    /**
     * Stores FULL unprocessed transactions which was source of this transaction. Could be used later for detailed analysis
     */
    unprocessedSources?: string;
    /**
     * IDs of unprocessed transaction - to match later
     */
    externalIds?: Array<string>;
    movements: Array<Movement>;
}

