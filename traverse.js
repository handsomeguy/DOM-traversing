// 用于遍历DOM节点
// 遍历文本节点  为避免换行符 空格符导致文本节点出现 会过滤掉不含字符的文本节点
// 遍历顺序先子后父

( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "this module requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( w ){

	// 问题如注释1
	// var stack_travere = [];

	function stack_ele(dom) {
		return {
			dom:dom,
			index:dom.childNodes.length
		}
	}

	function getStackTop(stack_travere) {
		return stack_travere[stack_travere.length - 1];
	}

	function getNextChildIndex(obj) {
		return obj.dom.childNodes.length - obj.index;
	}

	function filterToLog(dom,filter,traverse_result) {
		if(dom.nodeName.toLowerCase() == filter.toLowerCase()){
			console.log(dom);
			traverse_result.push(dom);
			return;
		}
		// 类查找
		if(filter[0] == '.' && filter.length >= 1){

			// 文本节点直接跳过
			if(typeof dom.classList == 'undefined'){
				return;
			}
			var classList = [].slice.call(dom.classList);
			if(classList.indexOf(filter.slice(1)) != -1){
				console.log(dom);
				traverse_result.push(dom);
				return;
			}
		}

	}
	// 注释1：这里的共用变量实现数据共享
	// 但是会出现另一个问题 因为handleNode函数要多次调用 每次调用所传的参数和过滤条件是不一样的
	// 所以如果直接在这里设置一个共用变量 会导致共享同一个闭包 数据互相污染
	// var filter_share = '';


	// 为了有共用变量 所以封装多一层函数闭包
	// 因为handleNode要访问共用变量是查找作用域链的 所以要把handleNode函数的定义放入其中
	// 又因为handleNode和returnToParentNode的相互调用 所以returnToParentNode的定义也放入其中
	w.traverse = function (dom,filter,cb) {

		var stack_travere = [];
		// 符合遍历条件的结果
		var traverse_result = [];

		handleNode(dom,filter);
		function handleNode(dom,filter) {
			//无条件入栈 识别节点状态
			stack_travere.push(stack_ele(dom));
			let len = dom.childNodes.length;
			// 如果为叶子节点 弹栈
			if( len == 0 ){
				let ele = stack_travere.pop();
				let str = ele.dom.nodeValue;
				let reg = /^[\s|\n]+$/;
				if(!reg.test(str)){
					filterToLog(ele.dom,filter,traverse_result);
				}
				returnToParentNode(filter);
				return;
			}

			// 如果为非叶子节点  进行遍历子节点 首次取子节点第一个进行处理 
			// 增加index记录遍历到第几个子节点
			handleNode( dom.childNodes[ getNextChildIndex( getStackTop(stack_travere) ) ] ,filter )
		};


		function returnToParentNode(filter) {
			let parent = getStackTop(stack_travere);
			if(typeof parent == 'undefined'){
				console.log('traverse finished')
				return;
			}
			if( 0 == --parent.index){
				stack_travere.pop();
				filterToLog(parent.dom,filter,traverse_result);
				returnToParentNode(filter);
			}else{
				handleNode( parent.dom.childNodes[ getNextChildIndex( parent ) ]   , filter)
			}
		}

		if(typeof cb == 'function'){
			return cb(traverse_result);
		}else{
			return traverse_result;
		}
	};

	return w.traverse
})

 







