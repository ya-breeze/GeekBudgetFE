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


export interface Account { 
    id: string;
    name: string;
    description?: string;
    type: Account.TypeEnum;
}
export namespace Account {
    export type TypeEnum = 'expense' | 'income' | 'asset';
    export const TypeEnum = {
        Expense: 'expense' as TypeEnum,
        Income: 'income' as TypeEnum,
        Asset: 'asset' as TypeEnum
    };
}


