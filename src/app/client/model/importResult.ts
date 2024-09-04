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


export interface ImportResult { 
    /**
     * Date of import
     */
    date?: string;
    /**
     * Status of import
     */
    status?: ImportResult.StatusEnum;
    /**
     * Details of import
     */
    description?: string;
}
export namespace ImportResult {
    export type StatusEnum = 'success' | 'error';
    export const StatusEnum = {
        Success: 'success' as StatusEnum,
        Error: 'error' as StatusEnum
    };
}


