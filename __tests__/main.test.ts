import { run } from '../src';

describe('run function', () => {
  // Read more about fake timers
  // http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // const name = 'John';
  // let hello: string;

  // Act before assertions
  // beforeAll(async () => {
  //   const p: Promise<string> = greeter(name);
  //   jest.runOnlyPendingTimers();
  //   hello = await p;
  // });

  // Assert if setTimeout was called properly
  it('asks the user for their github credentials', () => {
    expect(run).toHaveBeenCalledTimes(1);
    // expect(setTimeout).toHaveBeenLastCalledWith(
    //   expect.any(Function),
    //   Delays.Long,
    // );
  });

  // Assert greeter result
  // it('greets a user with `Hello, {name}` message', () => {
  //   expect(hello).toBe(`Hello, ${name}`);
  // });
});
