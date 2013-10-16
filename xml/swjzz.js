console.log(require('yase').build({
	dbid:'swjzz',
	schema:function() {
		this.toctag(["xml","book","chapter","section"])
		      .emptytag("pb").attr("pb","n",{"prefix":"book[id]","saveval":true})
		      .attr("book","id",{"saveval":true})			  
			  .attr("chapter","id",{"prefix":"book[id]","saveval":true,"unique":true})
			  .attr("section","id",{"prefix":"chapter[id]","saveval":true,"unique":true})
	},
	toc : { 
		"logical":["book","chapter","section"]
		,"physical":["book","pb"] 
	},
	input:'swjzz.lst',
	output:'../swjzz.ydb',
	version:'0.0.0',
}));