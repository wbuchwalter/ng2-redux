export function invariant(condition: boolean, message: string, context?: any) {
    if (!condition) {
        if (context) {
          throw new Error(`${message}: ${context}`);
        }

        throw new Error(message);
    }
}
