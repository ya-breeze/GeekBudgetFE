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


export interface BankImporterNoIDMappingsInner { 
    /**
     * Field in transaction which should be match this mapping
     */
    fieldToMatch?: BankImporterNoIDMappingsInner.FieldToMatchEnum;
    /**
     * Value which should be in field to match this mapping
     */
    valueToMatch?: string;
    /**
     * Tag which should be set if mapping is matched
     */
    tagToSet?: string;
}
export namespace BankImporterNoIDMappingsInner {
    export type FieldToMatchEnum = 'user';
    export const FieldToMatchEnum = {
        User: 'user' as FieldToMatchEnum
    };
}


