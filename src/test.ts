// so the current state is this:
// i want a library such that you can just type player.position to get the position, IE components as properties
// ...but for dynamic properties, you need something like Record which doesnt provide type hints
// below is the expected use of the library
// my current thought is to use partial types on entity. it isnt very dynamic but it may be the only option.
// to be honest i really dont like the Partial type solution.
// it just isnt really ECS anymore at that point
// maybe I can do something with making Entity an object with the components as a Record property?
// would mean having to do e.data.[component name] but im willing to do that if everything else works
// at that point i might as well just do e.get(), but then e.set() would have to be a thing which kind of sucks.
// maybe I can do something a little more low-tech. something like bitfields or a huge table. but then theres still no type hints
// so whats the point?? I might be overcomplicating it. Every solution so far is missing something
// - components as classes: have to define a constructor (ugly, stupid, hate it) [https://maxwellforbes.com/posts/typescript-ecs-implementation/]
// - partial (need to update global entity var to add new component, boring, not really ECS)
// - entities at index as component array (difficult to remove specific component, no type hints)
// I originally had an idea of not using a global entity list. Maybe if I find a way to make that work I can leverage accessing entities through their components?
// I think I need to sit down and draw out all the possible interactions. Like, *when* would I be needing to check for types etc? Maybe I can get away with
// storing entities in a way that doesnt support it and then when I get() it does type stuff? I dont know.
// maybe I can combine solutions. dense/sparse at component level is nice but maybe instead entity is {id, components} and global dense & sparse,
// then some mysterious other thing that allows me to access components with type hints working. or maybe dense/sparse comp level and entity just id and
// just deal with ecs.get(i)
// i just really want to avoid having to do ecs.get(i).get('position').x
// but maybe i can deal with just e.get('position').x, type hints would work
// but setting is tough. e.set('position', {x: 5, y: 5} as Position) --- this is pretty unforgivable. no type hitns till after you type as? terrible.
// could do e.get(position).x = 5 but then id have to make sure everything is immutable. would just be so much nicer to have get be e.position.x and set be e.position.x = 5
// could get that working with records but then no type hints :/
// idea over weekend: use getters and setters with .attribute access

// double check chatgpt:
// "Partial<T> doesn't have any runtime impact on memory or performance. It's purely a compile-time construct used by the TypeScript compiler to perform type checking."

/* --- DEMO CODE --- */
const ecs = new ECS();

// create new component type
interface Position {
   x: number;
   y: number;
}

interface Aggression {
   range: number;
}

// create new player entity
const player = ecs.create({
   position: {
      x: 10,
      y: 5,
   },
});

// create enemy entity template
const tEnemy = {
   aggression: 10,
};

// use template to instantiate multiple entities with different positions
const enemies = [];
for (const x in [1, 2, 3, 4, 5]) {
   const pos: Position = {
      x: +x,
      y: 4,
   };
   enemies.push(ecs.create(tEnemy, pos));
}

// access component of entity
console.log(player.position.x);
console.log(enemies[3].aggression);

// add a new component to entity
player.affinity = 20;

// access new component
player.affinity;

// access maybe undefined property (???)
player.health.max = 10;

// remove component of entity
player.affinity = undefined;

// get all entities matching a component query
ecs.getAll((e) => {
   return e.position.x > 20;
});

// optionally check if entity conforms to a template
player.is(tEnemy);
