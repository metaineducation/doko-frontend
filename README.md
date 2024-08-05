合约接口调用示例
https://github.com/estatetrader/estate_trader_contract/blob/master/test/exchange.js

# vue3-temp2

添加 vscode 编辑器 settings.json 配置
"editor.codeActionsOnSave": {
"source.fixAll.tsLint": true,
"source.fixAll.eslint": true,
"source.fixAll.stylelint": true
}

如果 vscode 遇到 Delete 'cr' [prettier/prettier]? 报错

在.eslintrc.cjs 里面添加下内容（参考：https://stackoverflow.com/questions/53516594/why-do-i-keep-getting-delete-cr-prettier-prettier）
'prettier/prettier': [
'error',
{
endOfLine: 'auto',
},

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

想要缓存路由， 在 layout.vue 里面 include 添加指定的路由名字，可以看 layout.vue 里面的注释
