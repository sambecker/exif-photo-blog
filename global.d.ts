//解决ts报错：无法找到模块“popular-movie-quotes”的声明文件。“C:/mypracticeprojects/demo_practice/j-images-blog/node_modules/.pnpm/popular-movie-quotes@1.2.4/node_modules/popular-movie-quotes/index.js”隐式拥有 "any" 类型。
//尝试使用 `npm i --save-dev @types/popular-movie-quotes` (如果存在)，或者添加一个包含 `declare module 'popular-movie-quotes';` 的新声明(.d.ts)文件ts(7016)

declare module 'popular-movie-quotes' {
	const content: any;
	export = content;
}
