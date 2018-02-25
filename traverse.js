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

	var stack_travere = [];

	function stack_ele(dom) {
		return {
			dom:dom,
			index:dom.childNodes.length
		}
	}

	function getStackTop() {
		return stack_travere[stack_travere.length - 1];
	}

	function getNextChildIndex(obj) {
		return obj.dom.childNodes.length - obj.index;
	}

	function handleNode(dom) {
		//无条件入栈 识别节点状态
		stack_travere.push(stack_ele(dom));
		let len = dom.childNodes.length;
		// 如果为叶子节点 弹栈
		if( len == 0 ){
			let ele = stack_travere.pop();
			let str = ele.dom.nodeValue;
			let reg = /^[\s|\n]+$/;
			if(!reg.test(str)){
				console.log(ele.dom);
			}
			returnToParentNode();
			return;
		}

		// 如果为非叶子节点  进行遍历子节点 首次取子节点第一个进行处理 
		// 增加index记录遍历到第几个子节点
		handleNode( dom.childNodes[ getNextChildIndex( getStackTop() ) ] )
	}

	function returnToParentNode() {
		let parent = getStackTop();
		if(typeof parent == 'undefined'){
			console.log('traverse finished')
			return;
		}
		if( 0 == --parent.index){
			stack_travere.pop();
			console.log(parent.dom);
			returnToParentNode();
		}else{
			handleNode( parent.dom.childNodes[ getNextChildIndex( parent ) ] )
		}
	}

	w.traverse = handleNode;

	return w.traverse
})

 







