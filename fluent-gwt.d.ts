export as namespace fluentGwt;

export function given(description: string, handler: () => any): whenActable
export function arrange (description: string, handler: () => any): whenActable

declare interface whenActable {
    when: (description: string, handler: (any) => any) => thenAssertable
    act: (description: string, handler: (any) => any) => thenAssertable
}

declare interface thenAssertable {
    then: (description: string, handler: (any) => any) => Promise<any>
    assert: (description: string, handler: (any) => any) => Promise<any>
}