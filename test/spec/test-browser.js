describe('wzhik can interact with DOM', function(){

	describe('Can be attached to existing DOM element as template', function(){

		it('Simple attach', function(){
			// WARNING: Attached templates have no partials support
			// wzhik can be attached to existing DIV with template's content
			// in this example #hello is existing DIV contains code like <h1>{{= data.greetings }}</h1>
			var existingDIV = "#hello";
			// Expected result
			var expect = "<h1>Hello, world!</h1>";
			// Template
			// attach 
			var template  = wzhik( existingDIV ).attach();
			// Rendering
			// renderTo means rendering inside attached element
			template.renderTo({greetings : "Hello, world!"});
			// Check the result
			assert.equal(jQuery(existingDIV).html(), expect);
		});

	});


	describe('Can update attached DOM element', function(){

		it('Text node update', function(){
			// Template example
			// <div id="test-update" style="display:none">
			// 	<span>{{= data.name }} {{= data.lastname }}</span>
			// 	<div class="{{= data.class }}">{{= Math.round(data.rand) }}</div>
			// 	{{ if (data.items) }}
			// 		<ul>
			// 			{{ each( data.items ) }}
			// 				<li>{{= item }}</li>
			// 			{{ endeach }}
			// 		</ul>
			// 	{{ end }}
			// </div>
			var data = {
				name : "John",
				lastname : "Doe",
				items : [1, 2, 3],
				rand : Math.random()
			};

			// Template id 
			var existingDIV = "#test-update";
			var template  = wzhik( existingDIV ).attach();
			// Rendering
			template.renderTo( data );

			data.name = "Evgeny";
			data.lastname = "Korzun";
			template.update( data );

			// Check the result
			// Timeout need because wzhik updates DOM async
			setTimeout(function(){
				assert.equal(jQuery("span", existingDIV).html(), "Evgeny Korzun");
			}, 300);
		});


		it('Attribute update', function(){
			var data = {
				name : "John",
				lastname : "Doe",
				items : [1, 2, 3],
				rand : Math.random()
			};

			// Template id 
			var existingDIV = "#test-update";
			var template  = wzhik( existingDIV ).attach();
			// Rendering
			template.renderTo( data );

			data.class = "myclass";
			template.update( data );

			// Check the result
			// Timeout need because wzhik updates DOM async
			setTimeout(function(){
				assert.equal(jQuery(".myclass", existingDIV).length, 1);
			}, 300);
		});

		it('Arrays update: remove elements', function(){
			var data = {
				name : "John",
				lastname : "Doe",
				items : [1, 2, 3],
				rand : Math.random()
			};

			// Template id 
			var existingDIV = "#test-update";
			var template  = wzhik( existingDIV ).attach();
			// Rendering
			template.renderTo( data );

			delete data.items[2];
			template.update( data );

			// Check the result
			// Timeout need because wzhik updates DOM async
			setTimeout(function(){
				assert.equal(jQuery("ul", existingDIV).html(), "<li>1</li><li>2</li>");
			}, 300);

		});


		it('Arrays update: add elements', function(){
			var data = {
				name : "John",
				lastname : "Doe",
				items : [1, 2, 3],
				rand : Math.random()
			};

			// Template id 
			var existingDIV = "#test-update";
			var template  = wzhik( existingDIV ).attach();
			// Rendering
			template.renderTo( data );

			data.items.push(4);
			data.items.push(5);
			template.update( data );

			// Check the result
			// Timeout need because wzhik updates DOM async
			setTimeout(function(){
				assert.equal(jQuery("ul", existingDIV).html(), "<li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>");
			}, 300);

		});


		it('Arrays update: update element', function(){
			var data = {
				name : "John",
				lastname : "Doe",
				items : [1, 2, 3],
				rand : Math.random()
			};

			// Template id 
			var existingDIV = "#test-update";
			var template  = wzhik( existingDIV ).attach();
			// Rendering
			template.renderTo( data );

			data.items[1] = "Hello, World";
			template.update( data );

			// Check the result
			// Timeout need because wzhik updates DOM async
			setTimeout(function(){
				assert.equal(jQuery("li:eq(1)", existingDIV).html(), "Hello, World");
			}, 300);

		});

	});

});