/**
 * @author mrdoob / http://mrdoob.com/
 */

import { ModelElement } from './model.js';
import { Box3, DirectionalLight, HemisphereLight, Mesh, MeshPhongMaterial } from './three.modules.js';
import { STLLoader } from './loaders/STLLoader.js';

class StlModelElement extends ModelElement {

	constructor() {

		super();

		var scope = this;

		var light = new HemisphereLight( 0xaaaaff, 0x806060, 0.2 );
		light.position.set( 0, 1, 0 );
		scope.scene.add( light );

		var light = new DirectionalLight( 0xffffff, 0.8 );
		light.position.set( 1, 1, 1 );
		scope.scene.add( light );

		scope.cameraDistance = 1;

		function animate( time ) {

			time /= 2000;

			var distance = scope.cameraDistance;

			scope.camera.position.x = Math.sin( time ) * distance;
			scope.camera.position.y = distance / 3;
			scope.camera.position.z = Math.cos( time ) * distance;
			scope.camera.lookAt( scope.scene.position );

			scope.renderer.render( scope.scene, scope.camera );

			requestAnimationFrame( animate );

		}

		requestAnimationFrame( animate );

	}

	static get observedAttributes() { return [ 'src' ]; }

	attributeChangedCallback( attribute, oldValue, newValue ) {

		var scope = this;

		if ( attribute === 'src' ) {

			new STLLoader().load( newValue, function ( geometry ) {

				var object = new Mesh( geometry, new MeshPhongMaterial() );

				scope.cameraDistance = new Box3().setFromObject( object ).getSize().length();
				scope.scene.add( object );

			} );

		}

	}

}

customElements.define( 'model-stl', StlModelElement );
