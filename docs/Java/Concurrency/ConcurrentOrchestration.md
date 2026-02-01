# 并发编排

## CompletableFuture

- 创建
    - `runAsync`: 创建一个无返回值的 `CompletableFuture` 的实例
    - `supplyAsync`: 创建一个有返回值 `CompletableFuture` 的实例
    - `allOf`: 创建一个等到所有 `CompletableFuture` 完成的实例
    - `anyOf`: 创建一个匹配最快完成的 `CompletableFuture` 实例

- 转换
    - `thenApply`: `CompletableFuture` 实例结果转换（同步）
    - `thenApplyAsync`: `CompletableFuture` 实例结果转换（异步）

- 异常处理
    - `exceptionally`: 只有异常参数
    - `handle`: 有返回值和异常参数