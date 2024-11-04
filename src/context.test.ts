import { ContextManager } from "./context.ts";
import { assert } from "jsr:@std/assert"
Deno.test("ContextManager", async t => {
    await t.step("should able to create", t => {
        const cm = new ContextManager<string>()
        const foo = cm.create(() => "foo")
        const bar = cm.create(() => foo() + "bar")
        const barAsync = cm.create(async () => bar())
        const random = cm.create(() => Math.random())
        const withInit = cm.create(() => cm.initValue())
        cm.run(async () => {
            assert(foo() === "foo", "cant get foo")
            assert(bar() === "foobar", "cant get bar")
            assert(await barAsync() === "foobar", "cant get async bar")
            assert(random() === random(), "fn called twice")
            assert(withInit() === "init", "init value not passed correctly")
        }, "init")
    })
})