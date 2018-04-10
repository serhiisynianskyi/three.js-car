"use strict";
window.onload = function() {
	let canvas = document.getElementById('canvas'),
		scene = new THREE.Scene();

	let camera, renderer, light, controls, stats, textureCube, carGroup;
	initScene();
	addLights();
	rendering();
	generateCar();
	createBackgroundScene();
	let materials = {
		"Orange": new THREE.MeshLambertMaterial({ color: 0xff6600, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 }),
		"Yellow": new THREE.MeshLambertMaterial({ color: 0xffc700, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 }),
		"Blue": new THREE.MeshLambertMaterial({ color: 0x001133, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 }),
		"Red": new THREE.MeshLambertMaterial({ color: 0x660000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),
		"Black": new THREE.MeshLambertMaterial({ color: 0x000000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.15 }),
		"White": new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),
		"Green": new THREE.MeshLambertMaterial({ color: 0x00ff00, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),
		"Pink": new THREE.MeshLambertMaterial({ color: 0xff51f0, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),
		"LightBlue": new THREE.MeshLambertMaterial({ color: 0x51dcff, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),


		"Carmine": new THREE.MeshPhongMaterial({ color: 0x770000, specular: 0xffaaaa, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"Gold": new THREE.MeshPhongMaterial({ color: 0xaa9944, specular: 0xbbaa99, shininess: 50, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"Bronze": new THREE.MeshPhongMaterial({ color: 0x150505, specular: 0xee6600, shininess: 10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),
		"Chrome": new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, envMap: textureCube, combine: THREE.MultiplyOperation }),

		"Orange metal": new THREE.MeshLambertMaterial({ color: 0xff6600, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"Blue metal": new THREE.MeshLambertMaterial({ color: 0x2894d3, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"DBlue_metal": new THREE.MeshLambertMaterial({ color: 0xf28100, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"DOrange_metal": new THREE.MeshLambertMaterial({ color: 0xf48c42, envMap: textureCube, combine: THREE.MultiplyOperation }),

		"LBlue_metal": new THREE.MeshPhongMaterial({ color: 0x150505, specular: 0x008aee, shininess: 10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 }),
		"Red metal": new THREE.MeshLambertMaterial({ color: 0x770000, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"Green metal": new THREE.MeshLambertMaterial({ color: 0x00ff26, envMap: textureCube, combine: THREE.MultiplyOperation }),
		"Black metal": new THREE.MeshLambertMaterial({ color: 0x060606, envMap: textureCube, combine: THREE.MultiplyOperation }),

		"Pure chrome": new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: textureCube }),
		"Dark chrome": new THREE.MeshLambertMaterial({ color: 0x444444, envMap: textureCube }),
		"Darker chrome": new THREE.MeshLambertMaterial({ color: 0x222222, envMap: textureCube }),

		"Black glass": new THREE.MeshLambertMaterial({ color: 0x101016, envMap: textureCube, opacity: 0.975, transparent: true }),
		"Dark glass": new THREE.MeshLambertMaterial({ color: 0x101046, envMap: textureCube, opacity: 0.25, transparent: true }),
		"Blue glass": new THREE.MeshLambertMaterial({ color: 0x668899, envMap: textureCube, opacity: 0.75, transparent: true }),
		"Light glass": new THREE.MeshBasicMaterial({ color: 0x223344, envMap: textureCube, opacity: 0.25, transparent: true, combine: THREE.MixOperation, reflectivity: 0.25 }),

		"Red glass": new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.75, transparent: true }),
		"Yellow glass": new THREE.MeshLambertMaterial({ color: 0xffffaa, opacity: 0.75, transparent: true }),
		"Orange glass": new THREE.MeshLambertMaterial({ color: 0x995500, opacity: 0.75, transparent: true }),

		"Orange glass 50": new THREE.MeshLambertMaterial({ color: 0xffbb00, opacity: 0.5, transparent: true }),
		"Red glass 50": new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.5, transparent: true }),

		"Fullblack rough": new THREE.MeshLambertMaterial({ color: 0x000000 }),
		"Black rough": new THREE.MeshLambertMaterial({ color: 0x050505 }),
		"Darkgray rough": new THREE.MeshLambertMaterial({ color: 0x090909 }),
		"Red rough": new THREE.MeshLambertMaterial({ color: 0x330500 }),

		"Darkgray shiny": new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x050505 }),
		"Gray shiny": new THREE.MeshPhongMaterial({ color: 0x050505, shininess: 20 }),
		"Black wheel": new THREE.MeshStandardMaterial({ color: 0x090909, metalness: 1, roughness: 1 }),
		"UBlack": new THREE.MeshStandardMaterial({ color: 0x500000, metalness: 1, roughness: 0.2, envMap: textureCube }),
		"URed": new THREE.MeshStandardMaterial({ color: 0x040000, metalness: 1, roughness: 0.2, envMap: textureCube }),
		"Invisible": new THREE.MeshLambertMaterial({opacity: 0., transparent: true })
	};
	let frameMaterial = materials['Chrome'],
		bodyMaterial = materials['UBlack'],
		wheelsMaterial = materials['Black wheel'],
		sideMaterial = materials['URed'],
		exhaustPipesMaterial = materials['Chrome'],
		backLightsMaterial1 = materials['Red glass'],
		backLightsMaterial2 = materials['Red'],
		frontBumperMaterial = materials['URed'],
		backBumperMaterial = materials['URed'],
		Invisible = materials['Invisible'];

	function initScene() {
		camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
		renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas }); // antialias - сглаживаем ребра
		camera.position.set(200, 215, 200);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		// renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.gammaInput = renderer.gammaOutput = true;
		renderer.toneMapping = THREE.LinearToneMapping;
		// renderer.toneMappingExposure = 1;

		textureCube = new THREE.CubeTextureLoader()
			.setPath('./cube/snow_dust/')
			.load(['sleepyhollow_ft.jpg', 'sleepyhollow_bk.jpg', 'sleepyhollow_up.jpg', 'sleepyhollow_dn.jpg', 'sleepyhollow_rt.jpg', 'sleepyhollow_lf.jpg']);
		// scene.background = textureCube;
		// scene.background = 0x000000;
	}

	function resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		renderer.setSize(window.innerWidth - 5, window.innerHeight - 5);
		camera.updateProjectionMatrix()
	}

	function addLights() {
		let spotLight;
		let d = 500;
		spotLight = new THREE.SpotLight(0xffffff, 1, 800, 0.5, 0.9);
		spotLight.position.set(0, 400, 0);
		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 800;
		// spotLight.shadow.camera.fov = 30;
		// spotLight.shadow.camera.left = -d;
		// spotLight.shadow.camera.right = d;
		// spotLight.shadow.camera.top = d;
		// spotLight.shadow.camera.bottom = -d;
		// spotLight.shadow.camera.far = 1800;
		// scene.add(new THREE.AmbientLight(0xffffff, 0.2));
		// scene.add(new THREE.AmbientLight(0xffffff, 1));
		scene.add(spotLight);
		// let helper = new THREE.SpotLightHelper( spotLight, 5 );
		// scene.add( helper )
	}

	function createBackgroundScene() {
		let giftBump = new THREE.TextureLoader().load('images/plane.png');

		let backgroundSceneGeometry = new THREE.PlaneGeometry(500, 500, 2),
			backgroundSceneMaterial = new THREE.MeshStandardMaterial({
				color: 0x999999,
				side: THREE.DoubleSide,
				// map:giftBump,
				bumpMap: giftBump,
				// overdraw: true  
			}),
			backgroundSceneMesh = new THREE.Mesh(backgroundSceneGeometry, backgroundSceneMaterial);
		backgroundSceneMesh.rotateX((90 * Math.PI) / 180);
		backgroundSceneMesh.castShadow = true;
		backgroundSceneMesh.receiveShadow = true;
		scene.add(backgroundSceneMesh);
	}

	function generateCar() {
		let meshes = [],
			objLoader = new THREE.OBJLoader();
		objLoader.load('./models/Avent_sport.obj', function(object) {
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					meshes.push(child);
					// debugger
				}
			});
			// let carMesh = meshes[2];

			// carMesh.material =  new THREE.MeshLambertMaterial({ color: 0x101046, opacity: 0.8, envMap: textureCube, transparent: true });
			// carMesh.scale.x = carMesh.scale.y = carMesh.scale.z = 100;
			// carMesh.geometry.groups[3].material =  new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 1,  transparent: true });
			// console.log(carMesh)

			//porshe
			carGroup = new THREE.Group();
			meshes.forEach(function(item, index) {
				let carMesh = item;
				carMesh.material = new THREE.MeshLambertMaterial({
					color: 0x101046,
					opacity: 1,
					transparent: true,
					// side: THREE.DoubleSide
				});
				carMesh.material = materials['Black metal'];
				carMesh.castShadow = true;
				carMesh.receiveShadow = true;
				carGroup.add(carMesh);
				// console.log(index)
				// console.log(index);
			});

			// Car body
			//special
			// carGroup.children[0].material = materials['White'];
			// carGroup.children[3].material = materials['White'];
			// carGroup.children[4].material = materials['White'];
			// carGroup.children[28].material = materials['White'];
			// carGroup.children[32].material = materials['White'];
			// carGroup.children[34].material = materials['White'];
			// carGroup.children[37].material = materials['White'];
			// carGroup.children[38].material = materials['White'];
			// carGroup.children[39].material = materials['White'];
			// carGroup.children[42].material = materials['White'];
			// carGroup.children[43].material = materials['White'];
			// carGroup.children[59].material = materials['White'];
			// carGroup.children[60].material = materials['White'];
			// carGroup.children[61].material = materials['White'];
			// carGroup.children[62].material = materials['White'];
			// carGroup.children[64].material = materials['White'];
			// carGroup.children[86].material = materials['Green'];
			// carGroup.children[87].material = materials['White'];
			// carGroup.children[98].material = materials['Red'];
			// carGroup.children[99].material = materials['White'];
			// carGroup.children[155].material = materials['Red'];
			// carGroup.children[156].material = materials['White'];
			// //standart

			let bodyArrayMaterial = [1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 35, 36, 40, 41, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 63, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 92, 93, 94, 95, 109, 113, 114, 115, 120, 122, 123, 124, 130, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 145, 150, 159, 160, 162, 164, 165, 167, 168, 169, 170, 171, 172, 223, 224, 234, 235, 236, 246],
				rearWindowsMaterial = [5, 21, 65, 70, 106, 125, 127, 163],
				spoilerMaterial = [294, 299, 298],
				wheelsParts = [302, 303, 304, 305],
				sideParts = [119, 129],
				backExhaustPipesArrayMaterial = [300, 351, 352, 353, 354, 355, 356, 357, 358, 359],
				frameArrayMaterial = [84, 85, 96, 97],
				innerFramesArrayMaterials = [301, 311, 372],
				backLightsMainMaterils = [201, 215, 217],
				backLightsDetalizationMaterils = [222, 293],
				mainHeavyFrame = [312],
				frontBumberArrayMaterial = [111, 116],
				backBumberArrayMaterial = [118, 128];

			bodyArrayMaterial.forEach(function(item) {
				carGroup.children[item].material = bodyMaterial;
			});
			rearWindowsMaterial.forEach(function(item) {
				carGroup.children[item].material = bodyMaterial;
			});
			spoilerMaterial.forEach(function(item) {
				carGroup.children[item].material = Invisible;
			});
			wheelsParts.forEach(function(item) {
				carGroup.children[item].material = wheelsMaterial;
			});
			sideParts.forEach(function(item) {
				carGroup.children[item].material = sideMaterial;
			});
			backExhaustPipesArrayMaterial.forEach(function(item) {
				carGroup.children[item].material = exhaustPipesMaterial;
			});
			frameArrayMaterial.forEach(function(item) {
				carGroup.children[item].material = exhaustPipesMaterial;
			});
			innerFramesArrayMaterials.forEach(function(item) {
				carGroup.children[item].material = exhaustPipesMaterial;
			});
			backLightsMainMaterils.forEach(function(item) {
				carGroup.children[item].material = backLightsMaterial1;
			});
			backLightsDetalizationMaterils.forEach(function(item) {
				carGroup.children[item].material = backLightsMaterial2;
			});
			mainHeavyFrame.forEach(function(item) {
				carGroup.children[item].material = exhaustPipesMaterial;
			});
			frontBumberArrayMaterial.forEach(function(item) {
				carGroup.children[item].material = frontBumperMaterial;
			});
			backBumberArrayMaterial.forEach(function(item) {
				carGroup.children[item].material = backBumperMaterial;
			});
			// Lamborgini logo
			carGroup.children[154].material = materials['Yellow'];
			carGroup.children[157].material = materials['Red'];
			// L logo
			carGroup.children[166].material = materials['Black metal'];

			//inner rear 
			// carGroup.children[90].material = materials['White'];
			// carGroup.children[91].material = materials['Green'];

			// notches
			// carGroup.children[31].material = materials['White'];
			// carGroup.children[29].material = materials['White'];
			// carGroup.children[33].material = materials['White'];
			// carGroup.children[107].material = materials['Red'];
			// carGroup.children[143].material = materials['Red'];

			// back window
			// carGroup.children[110].material = materials['Red'];
			// carGroup.children[112].material = materials['Red'];

			// back window parts
			// carGroup.children[146].material = materials['Red'];
			// carGroup.children[147].material = materials['White'];
			// carGroup.children[148].material = materials['Green'];
			// carGroup.children[151].material = materials['Green'];
			// carGroup.children[152].material = materials['Red'];
			// carGroup.children[153].material = materials['White'];

			//window frame
			// carGroup.children[121].material = materials['Green'];
			// carGroup.children[126].material = materials['White'];
			// carGroup.children[131].material = materials['Red'];
			// carGroup.children[144].material = materials['White'];
			// carGroup.children[414].material = materials['White'];
			// carGroup.children[399].material = materials['Red'];
			// carGroup.children[400].material = materials['White'];

			//windshield wipers
			// carGroup.children[100].material = materials['Green'];
			// carGroup.children[101].material = materials['Red'];
			// carGroup.children[102].material = materials['White'];
			// carGroup.children[103].material = materials['Green'];
			// carGroup.children[104].material = materials['Red'];
			// carGroup.children[105].material = materials['White'];

			//Lamborgini Name
			// carGroup.children[77].material = materials['White'];
			// carGroup.children[78].material = materials['Green'];
			// carGroup.children[79].material = materials['Pink'];
			// carGroup.children[80].material = materials['LightBlue'];
			// carGroup.children[82].material = materials['White'];

			// side light
			// carGroup.children[198].material = materials['White'];
			// carGroup.children[199].material = materials['Green'];

			// Panel
			// carGroup.children[403].material = materials['Green'];
			// carGroup.children[404].material = materials['Red'];
			// carGroup.children[405].material = materials['White'];

			// Different panel
			// carGroup.children[410].material = materials['Red'];
			// carGroup.children[411].material = materials['White'];
			// carGroup.children[412].material = materials['Green'];
			// carGroup.children[415].material = materials['Green'];

			// Inner car
			// carGroup.children[408].material = materials['White'];
			// carGroup.children[409].material = materials['Green']; 

			// glass
			// carGroup.children[204].material = materials['Dark glass'];
			// carGroup.children[205].material = materials['Dark glass'];
			// carGroup.children[206].material = materials['Dark glass'];
			// carGroup.children[207].material = materials['Dark glass'];
			// carGroup.children[208].material = materials['Dark glass'];
			// carGroup.children[209].material = materials['Green'];
			// carGroup.children[210].material = materials['Red'];
			// carGroup.children[213].material = materials['Red'];
			// carGroup.children[369].material = materials['Red'];
			// carGroup.children[373].material = materials['White'];

			// back glass
			// carGroup.children[407].material = materials['Red'];

			// front lights
			// carGroup.children[214].material = materials['White'];
			// carGroup.children[216].material = materials['Red'];

			// front light detalization
			// carGroup.children[218].material = materials['Red'];
			// carGroup.children[220].material = materials['White'];

			// front light parts
			// carGroup.children[219].material = materials['Red'];
			// carGroup.children[221].material = materials['Green'];
			// carGroup.children[225].material = materials['Red'];
			// carGroup.children[226].material = materials['White'];
			// carGroup.children[227].material = materials['Green'];
			// carGroup.children[228].material = materials['Red'];
			// carGroup.children[229].material = materials['White'];
			// carGroup.children[230].material = materials['Green'];
			// carGroup.children[231].material = materials['Red'];
			// carGroup.children[232].material = materials['White'];
			// carGroup.children[233].material = materials['Green'];
			// carGroup.children[237].material = materials['Red'];
			// carGroup.children[238].material = materials['White'];
			// carGroup.children[239].material = materials['Green'];
			// carGroup.children[240].material = materials['Red'];
			// carGroup.children[241].material = materials['White'];
			// carGroup.children[242].material = materials['Green'];
			// carGroup.children[243].material = materials['Red'];
			// carGroup.children[244].material = materials['White'];
			// carGroup.children[245].material = materials['Green'];
			// carGroup.children[247].material = materials['White'];
			// carGroup.children[248].material = materials['Green'];
			// carGroup.children[249].material = materials['Red'];
			// carGroup.children[250].material = materials['White'];
			// carGroup.children[251].material = materials['Green'];
			// carGroup.children[252].material = materials['Red'];
			// carGroup.children[253].material = materials['White'];
			// carGroup.children[254].material = materials['Green'];
			// carGroup.children[255].material = materials['Red'];
			// carGroup.children[256].material = materials['White'];
			// carGroup.children[257].material = materials['Green'];
			// carGroup.children[258].material = materials['Red'];
			// carGroup.children[259].material = materials['White'];
			// carGroup.children[260].material = materials['Green'];
			// carGroup.children[261].material = materials['Red'];
			// carGroup.children[262].material = materials['White'];
			// carGroup.children[263].material = materials['Green'];
			// carGroup.children[264].material = materials['Red'];
			// carGroup.children[265].material = materials['White'];
			// carGroup.children[266].material = materials['Green'];
			// carGroup.children[267].material = materials['Red'];
			// carGroup.children[268].material = materials['White'];
			// carGroup.children[269].material = materials['Green'];
			// carGroup.children[270].material = materials['Red'];
			// carGroup.children[271].material = materials['White'];
			// carGroup.children[272].material = materials['Green'];
			// carGroup.children[273].material = materials['Red'];
			// carGroup.children[274].material = materials['White'];
			// carGroup.children[275].material = materials['Green'];
			// carGroup.children[276].material = materials['Red'];
			// carGroup.children[277].material = materials['White'];
			// carGroup.children[278].material = materials['Green'];
			// carGroup.children[279].material = materials['Red'];
			// carGroup.children[280].material = materials['White'];
			// carGroup.children[281].material = materials['Green'];
			// carGroup.children[282].material = materials['Red'];
			// carGroup.children[283].material = materials['White'];
			// carGroup.children[284].material = materials['Green'];
			// carGroup.children[285].material = materials['Red'];
			// carGroup.children[286].material = materials['White'];
			// carGroup.children[287].material = materials['Green'];
			// carGroup.children[288].material = materials['Red'];
			// carGroup.children[289].material = materials['White'];
			// carGroup.children[290].material = materials['Green'];
			// carGroup.children[288].material = materials['Red'];
			// carGroup.children[289].material = materials['White'];
			// carGroup.children[290].material = materials['Green'];
			// carGroup.children[291].material = materials['Red'];
			// carGroup.children[292].material = materials['White'];

			// inner door
			// carGroup.children[431].material = materials['White'];
			// carGroup.children[432].material = materials['Green'];

			// inner door parts
			// carGroup.children[433].material = materials['Red'];
			// carGroup.children[434].material = materials['White'];
			// carGroup.children[435].material = materials['Green'];

			// inner car
			// carGroup.children[430].material = materials['Red'];
			// carGroup.children[436].material = materials['Green'];

			// helm parts
			// carGroup.children[424].material = materials['Green'];
			// carGroup.children[424].material = materials['Red'];
			// carGroup.children[425].material = materials['White'];
			// carGroup.children[426].material = materials['Green'];
			// carGroup.children[427].material = materials['Red'];
			// carGroup.children[428].material = materials['White'];
			// carGroup.children[429].material = materials['Green'];
			// carGroup.children[330].material = materials['Red'];
			// carGroup.children[331].material = materials['White'];
			// carGroup.children[364].material = materials['White'];
			// carGroup.children[392].material = materials['Green'];
			// carGroup.children[396].material = materials['Red'];
			// carGroup.children[397].material = materials['White'];
			// carGroup.children[317].material = materials['White'];
			// helm main parts
			// carGroup.children[393].material = materials['Red'];
			// carGroup.children[394].material = materials['White'];
			// carGroup.children[395].material = materials['Green'];

			// seat part
			// carGroup.children[418].material = materials['Green'];
			// carGroup.children[422].material = materials['Red'];
			// carGroup.children[387].material = materials['Red'];
			// carGroup.children[390].material = materials['Red'];

			// seat additional
			// carGroup.children[416].material = materials['Red'];
			// carGroup.children[417].material = materials['White'];
			// carGroup.children[420].material = materials['White'];
			// carGroup.children[421].material = materials['Green'];
			// carGroup.children[419].material = materials['Red'];
			// carGroup.children[423].material = materials['White'];
			// carGroup.children[363].material = materials['Red'];
			// carGroup.children[364].material = materials['White'];
			// carGroup.children[365].material = materials['Green'];
			// carGroup.children[366].material = materials['Red'];
			// carGroup.children[388].material = materials['White'];
			// carGroup.children[391].material = materials['White'];

			// back additional parts
			// carGroup.children[296].material = materials['Green'];
			// carGroup.children[297].material = materials['Red'];

			// inner parts
			// carGroup.children[295].material = materials['White'];

			// salon
			// carGroup.children[313].material = materials['White'];
			// carGroup.children[314].material = materials['Green'];
			// carGroup.children[315].material = materials['Red'];
			// carGroup.children[316].material = materials['White'];
			// carGroup.children[333].material = materials['Red'];
			// carGroup.children[334].material = materials['White'];
			// carGroup.children[362].material = materials['Green'];
			// carGroup.children[367].material = materials['White'];
			// carGroup.children[376].material = materials['White'];
			// carGroup.children[377].material = materials['Green'];
			// carGroup.children[378].material = materials['Red'];
			// carGroup.children[379].material = materials['White'];
			// carGroup.children[380].material = materials['Green'];

			// buttons
			// carGroup.children[318].material = materials['Red'];
			// carGroup.children[319].material = materials['White'];
			// carGroup.children[320].material = materials['Green'];
			// carGroup.children[321].material = materials['Red'];
			// carGroup.children[322].material = materials['White'];
			// carGroup.children[323].material = materials['Green'];
			// carGroup.children[324].material = materials['Red'];
			// carGroup.children[327].material = materials['Red'];
			// carGroup.children[328].material = materials['White'];
			// carGroup.children[329].material = materials['Green'];
			// carGroup.children[332].material = materials['Green'];
			// carGroup.children[384].material = materials['Red'];
			// carGroup.children[385].material = materials['White'];
			// carGroup.children[386].material = materials['Green'];
			// carGroup.children[389].material = materials['Green'];

			// rearview mirror
			// carGroup.children[325].material = materials['White'];

			// 	top rearview mirror
			// carGroup.children[326].material = materials['Green'];

			// chassis
			// carGroup.children[306].material = materials['Red'];
			// carGroup.children[307].material = materials['White'];
			// carGroup.children[308].material = materials['Green'];
			// carGroup.children[309].material = materials['Red'];
			// carGroup.children[310].material = materials['White'];

			// motor?
			// carGroup.children[335].material = materials['Green'];
			// carGroup.children[336].material = materials['Red'];
			// carGroup.children[337].material = materials['White'];
			// carGroup.children[338].material = materials['Green'];
			// carGroup.children[339].material = materials['Red'];
			// carGroup.children[340].material = materials['White'];
			// carGroup.children[341].material = materials['Green'];
			// carGroup.children[342].material = materials['Red'];
			// carGroup.children[343].material = materials['White'];
			// carGroup.children[344].material = materials['Green'];
			// carGroup.children[345].material = materials['Red'];
			// carGroup.children[346].material = materials['White'];
			// carGroup.children[347].material = materials['Green'];
			// carGroup.children[348].material = materials['Red'];
			// carGroup.children[349].material = materials['White'];
			// carGroup.children[350].material = materials['Green'];//ENGINE

			// special motor
			// carGroup.children[360].material = materials['Red'];
			// carGroup.children[361].material = materials['White'];

			// Display
			// carGroup.children[406].material = materials['Green'];
			// carGroup.children[413].material = materials['Red'];
			// carGroup.children[328].material = materials['White'];
			// carGroup.children[368].material = materials['Green'];

			// salon main parts
			// carGroup.children[381].material = materials['Red'];
			// carGroup.children[382].material = materials['White'];
			// carGroup.children[383].material = materials['Green'];

			// Undefined
			// carGroup.children[25].material = materials['White'];
			// carGroup.children[26].material = materials['Red'];
			// carGroup.children[27].material = materials['White'];
			// carGroup.children[30].material = materials['Red'];
			// carGroup.children[81].material = materials['Red'];
			// carGroup.children[83].material = materials['Green'];
			// carGroup.children[86].material = materials['Red'];
			// carGroup.children[88].material = materials['Red'];
			// carGroup.children[89].material = materials['Red'];
			// carGroup.children[108].material = materials['White'];
			// carGroup.children[117].material = materials['White'];
			// carGroup.children[149].material = materials['Red'];
			// carGroup.children[158].material = materials['Red'];
			// carGroup.children[161].material = materials['Red'];
			// carGroup.children[173].material = materials['Red'];
			// carGroup.children[174].material = materials['White'];
			// carGroup.children[175].material = materials['Green'];
			// carGroup.children[176].material = materials['Red'];
			// carGroup.children[177].material = materials['White'];
			// carGroup.children[178].material = materials['Green'];
			// carGroup.children[179].material = materials['Red'];
			// carGroup.children[180].material = materials['White'];
			// carGroup.children[181].material = materials['Green'];
			// carGroup.children[182].material = materials['Red'];
			// carGroup.children[183].material = materials['White'];
			// carGroup.children[184].material = materials['Green'];
			// carGroup.children[185].material = materials['Red'];
			// carGroup.children[186].material = materials['White'];
			// carGroup.children[187].material = materials['Green'];
			// carGroup.children[188].material = materials['Red'];
			// carGroup.children[189].material = materials['White'];
			// carGroup.children[190].material = materials['Green'];
			// carGroup.children[191].material = materials['Red'];
			// carGroup.children[192].material = materials['White'];
			// carGroup.children[193].material = materials['Green'];
			// carGroup.children[194].material = materials['Red'];
			// carGroup.children[195].material = materials['White'];
			// carGroup.children[196].material = materials['Green'];
			// carGroup.children[197].material = materials['Red'];
			// carGroup.children[401].material = materials['Red'];
			// carGroup.children[402].material = materials['White'];
			// carGroup.children[202].material = materials['White'];
			// carGroup.children[203].material = materials['Green'];
			// carGroup.children[211].material = materials['White'];
			// carGroup.children[212].material = materials['Green'];
			// carGroup.children[370].material = materials['White'];
			// carGroup.children[371].material = materials['Green'];
			// carGroup.children[374].material = materials['Green'];
			// carGroup.children[375].material = materials['Red'];
			// carGroup.children[398].material = materials['Green'];

			// let geometry = new THREE.BoxGeometry(20, 20, 20);
			// let material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
			// let cube = new THREE.Mesh(geometry, material);
			// cube.position.set(100, 20, 50);
			// cube.castShadow = true;
			// cube.receiveShadow = true;
			// scene.add(cube);

			carGroup.scale.x = carGroup.scale.y = carGroup.scale.z = 30;
			carGroup.position.set(-40, 15, 0);
			carGroup.castShadow = true;
			carGroup.receiveShadow = true;
			scene.add(carGroup);

		});
	}


	controls = new THREE.OrbitControls(camera);
	// stats = new Stats();
	// window.fps.appendChild(stats.dom);

	function rendering() {
		requestAnimationFrame(rendering);
		renderer.render(scene, camera);
	};

	window.addEventListener('resize', function(e) {
		resize();
	});

};