# DOM-traversing
it is a fucking easy module to realize traversing your dom in your page.

you can just use script element to put in your code

### more function

英文编不下去了，我还是说中文吧

1、实现遍历树查找某类型子节点，例如p、span等  √

2、查找节点下的某类节点，例如 .subtype 的查找  √

3、实现允许传入回调函数，再查找完成后执行，实现对查找结果的附加功能执行，例如对查找结果的节点改变css样式 或者添加事件监听器。   √

### params

1、DOM Element：原生dom节点对象

2、filter：过滤条件，字符串格式，可以是类名过滤 也可以是普通的标签过滤。例'p'、'.haha'

3、callback：回调函数，传入符合条件的节点，用户可自行做其他处理


### example 

window.traverse(document.body)

window.traverse(document.getElementById('test'));

window.traverse(document.body,'.test',function (dom) {
	// access data which is selected from parent node
	console.log(dom)
})

### bug fixed

fix后的版本，避免了闭包共享的问题，其次增加了标签和类名查找功能，允许传入回调函数进行额外的DOM节点处理

### thanks

谢谢观看哈哈哈。.........
