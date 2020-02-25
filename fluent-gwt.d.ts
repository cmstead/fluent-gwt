export as namespace fluentGwt;

export function given(description: string, handler: () => any): whenActable
export function arrange(description: string, handler: () => any): whenActable
export function fromCallback(handler: callbackResolvingHandler): (any) => Promise<any>

declare type callbackResolvingHandler = (...args, callback: nodeCallback) => void;
declare type nodeCallback = (error: any, data: any) => void;

declare interface whenActable {
    when: (description: string, handler: (any) => any) => thenAssertable
    act: (description: string, handler: (any) => any) => thenAssertable
}

declare interface thenAssertable {
    then: (description: string, handler: (any) => any) => Promise<any>
    assert: (description: string, handler: (any) => any) => Promise<any>
}