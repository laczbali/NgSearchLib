export interface NgSearchTerm {
    searchMode: 'simple' | 'advanced';

    simpleSearchTerm: string;
    
    advancedSearchLink: 'and' | 'or';
    advancedTerms: NgAdvancedSearchTerm[];
}

export interface NgAdvancedSearchTerm {
    id: number;
    fieldName?: string;
    fieldType?: 'string' | 'number' | 'date';
    action?: 'contains' | 'equals' | 'larger than' | 'smaller than';
    searchTerm?: string;
    isNegated?: boolean;
}
