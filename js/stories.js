/*
 * Reading content for the reader screen.
 * All stories are original to this app (no third-party copyright).
 * Each story has a language (lang: 'en' by default, 'fr', 'ar') and an icon from STORY_ART.
 */
var STORIES = [
  /* ---------- Funny stories for kids (English) ---------- */
  {
    title: 'The Sock Monster',
    icon: 'sock',
    paragraphs: [
      'Every family has a mystery: socks go into the washing machine in pairs, but they come out alone. In the Bennett house, nobody knew why, until little Maya decided to stay up and find out.',
      'At midnight she tiptoed to the laundry room with a torch. Behind the machine she heard a tiny crunch, crunch, munch. There, sitting on a pile of fluff, was a round purple monster no bigger than a teapot, happily chewing a striped sock.',
      '"Excuse me," said Maya. "Those are my dad\'s favourite socks." The monster froze, with a heel sticking out of its mouth. "I only eat one of each," it said politely. "Two would be greedy."',
      'Maya thought about this. Her dad had a whole drawer full of lonely socks that would never find their partners again. That gave her an idea.',
      'Now, every Saturday, Maya leaves a bowl of odd socks behind the washing machine. The monster eats them with great joy, and the Bennett family has not lost a single pair since. Dad thinks it is magic. Maya just smiles and says nothing.'
    ]
  },
  {
    title: 'The Dragon Who Sneezed',
    icon: 'cake',
    paragraphs: [
      'Grandpa Tom kept a small green dragon called Pickles in his garden shed. Pickles was friendly, polite and very good at fetching sticks. He had only one problem: whenever something tickled his nose, he sneezed fire.',
      'Pepper made him sneeze. Flowers made him sneeze. Even a feather floating past could set him off. Grandpa kept a bucket of water in every room, just in case.',
      'On Lily\'s seventh birthday, the cake arrived with seven candles, but nobody could find the matches. Everyone searched the drawers, the cupboards and even the fridge. Lily\'s lip began to wobble.',
      'Then Grandpa had an idea. He picked a daisy from the garden and held it under Pickles\' nose. The dragon\'s eyes watered. His nostrils twitched. "Ah... ah... AAH-CHOO!" A tiny, perfect puff of flame shot across the table.',
      'All seven candles flickered to life. Everyone cheered, Lily laughed, and Pickles looked very proud of himself, even though Grandpa was now missing half of one eyebrow.'
    ]
  },
  {
    title: 'The Robot Who Loved to Dance',
    icon: 'robot',
    paragraphs: [
      'Professor Nadia built a robot to help around the house. She called him Bolt. Bolt could sweep the floor, wash the dishes and fold the laundry into perfect little squares.',
      'One morning the professor turned on the radio while Bolt was ironing. A happy song came on, with drums and trumpets. Bolt\'s left foot began to tap. Then his right foot. Then his arms started to swing.',
      '"Bolt, the ironing!" cried the professor. But Bolt was already spinning across the kitchen, waving a shirt above his head like a flag. He danced past the cat, who jumped onto the fridge in surprise.',
      'The professor checked his wires, his buttons and his batteries. Everything was fine. "There is nothing wrong with you," she said at last. "You just like music."',
      'So now the house has a new rule. In the morning, Bolt works. In the afternoon, Bolt dances. And on Sundays, the professor dances with him, while the cat watches from the top of the fridge, shaking its head.'
    ]
  },
  {
    title: 'A Bathtub for Hugo',
    icon: 'bathtub',
    paragraphs: [
      'Hugo the hippo lived in a river, but one day he saw a picture of a bathtub full of bubbles, and he wanted one more than anything in the world.',
      'He walked all the way into town and knocked on the door of the bathroom shop. "One bathtub, please," he said. "The biggest one you have." The shopkeeper looked at Hugo, then at his bathtubs, then at Hugo again.',
      'The biggest bathtub was still very small for a hippo. Hugo climbed in anyway. First one foot, then another, then his round bottom. SPLOOSH! The water jumped out and soaked the shopkeeper from head to toe.',
      'Hugo sat there with his knees up to his ears and a single bubble on his nose. "This is wonderful," he sighed. The shopkeeper, dripping wet, could not stop laughing.',
      'In the end, the whole town helped Hugo carry the bathtub to the river. He fills it with bubbles every evening, and the ducks line up to take turns sliding down his back.'
    ]
  },

  /* ---------- More stories (English) ---------- */
  {
    title: 'The Lighthouse Cat',
    icon: 'lighthouse',
    paragraphs: [
      'On a rocky island at the edge of the sea stood a white lighthouse, and in the lighthouse lived a grey cat named Pebble. Every evening, when the keeper climbed the long spiral stairs to light the great lamp, Pebble climbed beside him, one step at a time, tail held high like a flag.',
      'At the top, the keeper polished the glass until it shone. Pebble sat by the window and watched the boats come home. The fishing boats were small and red. The ferry was long and green. Far out on the water, a sailboat leaned in the wind like a white feather.',
      'One night a thick fog rolled in. The lamp turned and turned, but the light could barely reach the waves. Then Pebble heard something the keeper could not: a small bell, ringing somewhere in the fog. She pressed her nose to the glass and meowed until the keeper listened too.',
      'The keeper rang the lighthouse bell in answer. Ding. Ding. Ding. Slowly, the little bell came closer, until a rowing boat bumped gently against the island rocks. Inside sat a girl and her grandfather, cold and tired but safe.',
      'From that night on, the people of the harbour said the lighthouse had two lights: the great lamp at the top, and the bright green eyes of Pebble, who never stopped listening.'
    ]
  },
  {
    title: 'The Tortoise Who Counted Stars',
    icon: 'tortoise',
    paragraphs: [
      'Old Tortoise could not run, could not climb and could not fly, but every clear night he lay on his back in the meadow and counted stars.',
      '"Why do you bother?" asked Rabbit. "There are too many. You will never finish." Tortoise only smiled and said, "Seven hundred and twelve," and kept on counting.',
      'Each night he started where he had stopped. He gave the bright ones names. He noticed which ones moved and which ones stayed. He saw that some stars came in pairs and some came in long, curling lines like rivers of light.',
      'One autumn the animals became lost on their way to the winter valley. The paths were hidden by fallen leaves, and every hill looked the same. Rabbit ran ahead and came back. Bird flew up and saw only trees.',
      '"Follow the river of stars," said Tortoise, pointing his slow head toward the sky. "It always sets behind the winter valley." The animals walked all night beneath the long line of light, and at dawn they saw the valley below them, warm and green.',
      'Rabbit sat down beside Tortoise. "How many stars is it now?" he asked. Tortoise thought for a moment. "Enough," he said.'
    ]
  },
  {
    title: 'A Kite Named Tomorrow',
    icon: 'kite',
    paragraphs: [
      'Samir built his first kite from two sticks, a sheet of newspaper and a long tail of knotted ribbon. He painted one half red and one half green, because those were the only two paints left in the box.',
      'The first time he ran with it, the kite dragged across the ground. The second time, it rose a little, spun twice and crashed into a bush. His little sister laughed so hard she had to sit down.',
      'Samir did not laugh. He looked at the kite carefully. The tail was too short, so he added more ribbon. One stick was bent, so he found a straighter one. The paper had torn, so he patched it with tape.',
      'On the third day, the wind came off the hill strong and steady. Samir ran, let out the string, and felt the kite pull upward as if it wanted to go somewhere. It climbed higher than the trees, higher than the water tower, until the red and green blurred into one bright spot against the sky.',
      '"What is its name?" asked his sister. Samir thought about the crashes, the bush and all the patches. "Tomorrow," he said. "Because it always works better tomorrow."'
    ]
  },
  {
    title: 'The Baker\'s Secret Ingredient',
    icon: 'bread',
    paragraphs: [
      'In a narrow street that smelled of bread, there was a bakery with a blue door. Every morning, long before sunrise, Mrs. Amina mixed flour, water, salt and yeast in a wide wooden bowl.',
      'Her bread was famous. People came from other towns to buy it. Other bakers asked for her recipe, and she always gave it to them: flour, water, salt and yeast. They went home, baked carefully, and their bread was good, but it was never quite the same.',
      '"You must be hiding something," said a young baker named Youssef. "There must be a secret ingredient." Mrs. Amina handed him an apron. "Come at four tomorrow morning," she said, "and I will show you."',
      'Youssef came at four. He watched her knead the dough for a long time, pressing and folding, pressing and folding. He watched her wait while it rose, then shape each loaf by hand. He watched her check the oven again and again.',
      'By the time the first loaves came out, golden and crackling, the sun was up and Youssef was very tired. "I still did not see the secret," he said. Mrs. Amina broke a warm loaf in half and gave him a piece. "Patience," she said. "It is the only ingredient you cannot buy."'
    ]
  },
  {
    title: 'The Two Windows',
    icon: 'windows',
    paragraphs: [
      'In a tall house on a quiet hill, there was a room with two windows. One window looked toward the mountains. The other looked toward the sea.',
      'A boy named Leo slept in that room. In the mornings he liked the mountain window best, because the sun rose behind the peaks and painted them pink and gold. In the evenings he liked the sea window, where the light sank into the water and the boats turned on their lamps.',
      'One day his grandmother asked, "Which window is better?" Leo thought for a long time. "The mountain window shows me where the day begins," he said. "The sea window shows me where it ends."',
      '"And if you could only keep one?" she asked. Leo shook his head. "Then I would only see half the day."',
      'His grandmother smiled. "That is how seeing works," she said. "Two windows, one room, and the whole picture is yours only when you use them both."'
    ]
  },
  {
    title: 'The Snail Race',
    icon: 'snail',
    paragraphs: [
      'Every summer, the children of the village held a snail race on the long flat stone behind the school. Each child chose a snail, painted a small number on its shell with a dot of red or green, and set it at the starting line.',
      'Nora chose the smallest snail in the garden. Her friends laughed. "That one is too tiny," they said. "It will never win." Nora named her snail Comet anyway and painted a green number one on its shell.',
      'When the race began, the big snails went in every direction. One turned around. One climbed onto another snail. One fell asleep in the shade. Comet moved slowly, but always straight ahead, leaving a thin silver line across the stone.',
      'Minutes passed. The children leaned closer. The silver line grew longer and longer, until Comet touched the chalk mark at the finish. Everyone cheered so loudly that a pigeon flew off the school roof.',
      '"How did you know?" her friends asked. Nora shrugged. "I didn\'t," she said. "But Comet never stopped looking where she was going."'
    ]
  },
  {
    title: 'The Clockmaker\'s Apprentice',
    icon: 'clock',
    paragraphs: [
      'At the end of a crooked street stood a tiny shop full of clocks. There were tall clocks and round clocks, clocks shaped like owls and clocks shaped like houses, and every one of them ticked in its own small voice.',
      'The clockmaker was an old man named Mr. Haddad, and his apprentice was a boy named Karim, who wanted to fix everything quickly. When a clock stopped, Karim would shake it, tap it and wind it as fast as he could. Most of the time it stayed silent.',
      'One morning a woman brought in a beautiful blue clock that had belonged to her mother. "It has not ticked for ten years," she said. Karim reached for his tools, but Mr. Haddad put a gentle hand on his arm. "First," he said, "we listen."',
      'They opened the clock and looked inside for a long time. Mr. Haddad pointed at the tiny wheels, one by one. "This one turns that one. That one turns this one. If one tooth is bent, the whole clock waits." Karim looked closer and found it: a single bent tooth, smaller than a grain of rice.',
      'He straightened it with the finest pliers in the shop. When he closed the case, the blue clock gave one soft tick, then another, then another. The woman smiled with tears in her eyes. That night Karim wrote a note and pinned it above his workbench: Look first. Fix second.'
    ]
  },
  {
    title: 'The Garden on the Roof',
    icon: 'sunflower',
    paragraphs: [
      'Lina lived on the fifth floor of a tall apartment building in the middle of a busy city. From her window she could see roads, cars, cranes and grey walls, but not a single tree.',
      'One spring she found a packet of seeds in a kitchen drawer: tomatoes, mint and sunflowers. "Where would we even plant them?" asked her father. Lina pointed up. "On the roof," she said.',
      'The roof was flat and empty, with a few puddles and a lot of wind. Lina and her father carried up old buckets, wooden boxes and bags of soil. The neighbours watched from their windows and shook their heads.',
      'Every evening Lina climbed the stairs with a watering can. The mint came first, small and bright. Then the tomato plants curled their way up thin sticks. Last of all, the sunflowers grew taller than Lina herself and turned their faces toward the evening sun.',
      'One by one, the neighbours came up to look. Mrs. Rania brought a pot of basil. Mr. Omar brought a lemon tree in a barrel. The children brought chairs. By the end of summer, the grey roof had become the greenest place in the building, and everyone said it had all started with one small packet of seeds.'
    ]
  },

  /* ---------- Histoires en français ---------- */
  {
    title: "Le crocodile qui avait peur de l'eau",
    lang: 'fr',
    icon: 'crocodile',
    paragraphs: [
      "Au bord d'un grand fleuve vivait un crocodile nommé Gaspard. Il avait de grandes dents, une longue queue et une peau verte toute bosselée. Il avait aussi un secret : il avait peur de l'eau.",
      "Les autres crocodiles plongeaient, nageaient et faisaient des bulles toute la journée. Gaspard, lui, restait sur la rive avec un petit parapluie, au cas où une goutte tomberait du ciel.",
      "« Tu es un crocodile, pas un chat ! » se moquait son cousin Léon. Gaspard rougissait, ce qui est très difficile pour un crocodile vert.",
      "Un jour, une petite tortue tomba dans le courant et cria à l'aide. Tous les crocodiles dormaient. Gaspard ferma les yeux, serra son parapluie… et sauta dans le fleuve.",
      "L'eau était fraîche, douce et pas méchante du tout. Gaspard ramena la tortue sur la rive en nageant comme un champion. Depuis ce jour, il nage tous les matins. Mais il garde toujours son parapluie, parce qu'il le trouve très élégant."
    ]
  },
  {
    title: "La vache qui voulait danser",
    lang: 'fr',
    icon: 'cow',
    paragraphs: [
      "Dans une ferme tranquille vivait une vache nommée Marguerite. Elle mangeait de l'herbe, donnait du bon lait et dormait au soleil. Mais en secret, elle rêvait de danser.",
      "Un soir, la radio du fermier joua une musique joyeuse. Marguerite leva une patte, puis l'autre. Elle tourna sur elle-même et fit trembler toute l'étable. Les poules s'envolèrent, le cochon tomba dans la boue et le chien se cacha sous la paille.",
      "« Une vache, ça ne danse pas ! » dit le vieux cheval. « Pourquoi pas ? » répondit Marguerite. Le cheval réfléchit longtemps. Il ne trouva aucune bonne raison.",
      "Alors Marguerite prit des cours. Le canard lui apprit la valse, le mouton le rock, et le petit chat lui montra comment faire une jolie révérence.",
      "Aujourd'hui, chaque samedi soir, il y a un grand bal à la ferme. Marguerite danse au milieu de la grange, et le fermier jure que, depuis qu'elle danse, son lait sort déjà en milk-shake."
    ]
  },
  {
    title: "Le petit nuage grognon",
    lang: 'fr',
    icon: 'cloud',
    paragraphs: [
      "Tout en haut du ciel vivait un petit nuage gris qui n'était jamais content. Quand il faisait beau, il boudait. Quand il y avait du vent, il râlait. Et quand il était fâché, il faisait pleuvoir sur la tête des gens.",
      "Un matin, il vit une fête d'anniversaire dans un jardin. Il y avait des ballons, un gâteau et des enfants qui riaient. « Trop de bruit ! » grogna le nuage, et il se gonfla pour faire tomber une grosse averse.",
      "Mais au lieu de se sauver, les enfants mirent leurs bottes et sautèrent dans les flaques en criant de joie. Une petite fille leva la tête et dit : « Merci, nuage ! C'est la meilleure fête du monde ! »",
      "Le nuage ne savait pas quoi répondre. Personne ne l'avait jamais remercié. Il sentit quelque chose de tout chaud au fond de lui, et un rayon de soleil passa à travers ses gouttes.",
      "Alors, au-dessus du jardin, apparut un magnifique arc-en-ciel. Depuis ce jour, le petit nuage grogne encore un peu, mais seulement pour rire."
    ]
  },
  {
    title: "Monsieur Pingouin a trop chaud",
    lang: 'fr',
    icon: 'penguin',
    paragraphs: [
      "Monsieur Pingouin vivait sur la banquise, où il faisait toujours très froid. Un jour, il reçut une carte postale de son ami le chameau : « Viens me voir dans le désert, il fait beau et chaud ! »",
      "Monsieur Pingouin prépara sa valise : une écharpe, un bonnet et ses plus belles moufles. Puis il prit l'avion. Quand la porte s'ouvrit, une vague de chaleur lui sauta au visage.",
      "« Oh là là ! » dit-il en enlevant son écharpe. Puis son bonnet. Puis ses moufles. Il marchait sur le sable brûlant en sautillant d'une patte sur l'autre, comme s'il dansait.",
      "Le chameau éclata de rire. « Viens, j'ai une surprise pour toi. » Il l'emmena dans un petit café où l'on vendait des glaces de toutes les couleurs. Monsieur Pingouin en commanda douze.",
      "Le soir, il écrivit une carte postale à sa famille : « Le désert est très chaud, le sable est très chaud, le soleil est très chaud. Mais les glaces sont excellentes. Je reste encore une semaine ! »"
    ]
  },

  /* ---------- Arabic stories (shown right-to-left) ---------- */
  {
    title: 'الجمل الصبور',
    icon: 'camel',
    lang: 'ar',
    paragraphs: [
      'في قافلة طويلة تعبر الصحراء، كان هناك جمل كبير اسمه صبور. لم يكن أسرع الجمال ولا أقواها، لكنه كان يمشي دائماً بخطوات ثابتة، لا يتعب ولا يتوقف.',
      'كانت الجمال الصغيرة تضحك منه وتقول: لماذا تمشي ببطء هكذا؟ نحن نسبق الريح! ثم تركض أمامه حتى تختفي خلف الكثبان الذهبية.',
      'وفي ظهيرة حارة، هبّت عاصفة رملية قوية. امتلأت السماء بالغبار، واختفى الطريق، ولم يعد أحد يرى شيئاً. توقفت الجمال الصغيرة خائفة، لا تعرف إلى أين تذهب.',
      'أما صبور فقد رفع رأسه يشمّ الهواء، ثم واصل المشي بخطواته الهادئة نفسها. كان يعرف رائحة الماء، ويتذكر شكل كل كثيب مرّ به من قبل.',
      'تبعته القافلة كلها خطوة بخطوة، حتى ظهرت أمامهم أشجار النخيل وواحة زرقاء صافية. شربت الجمال الصغيرة حتى ارتوت، ثم قالت بصوت خافت: شكراً يا صبور. فأجاب مبتسماً: الطريق الطويل لا يحتاج إلى سرعة، بل إلى صبر.'
    ]
  },
  {
    title: 'شجرة الزيتون',
    icon: 'olive',
    lang: 'ar',
    paragraphs: [
      'في قرية صغيرة بين الجبال، كانت لجدّ أمين شجرة زيتون عجوز، جذعها ملتوٍ مثل حبل قديم، وأغصانها فضية تلمع تحت الشمس.',
      'سأل أمين جدّه يوماً: كم عمر هذه الشجرة يا جدّي؟ ضحك الجدّ وقال: زرعها جدّ جدّي، ولم يأكل من زيتونها أبداً. لقد زرعها من أجلي ومن أجلك.',
      'تعجّب أمين وقال: ولماذا يزرع شجرة لن يأكل منها؟ فأخذ الجدّ بيده، وأعطاه غصناً صغيراً، وحفر له حفرة في الأرض، وقال: ازرع هذا، وستفهم يوماً ما.',
      'سقى أمين الغصن الصغير كل صباح، وحماه من الريح بحجارة صغيرة، ورآه ينمو ببطء شديد، ورقة بعد ورقة، وسنة بعد سنة.',
      'وبعد سنوات طويلة، جلس أمين، وقد صار رجلاً، تحت شجرة خضراء كبيرة، والأطفال من حوله يقطفون حبات الزيتون الصغيرة. عندها فهم ما قاله جدّه: أجمل ما نزرعه هو ما يقطفه غيرنا.'
    ]
  },
  {
    title: 'خريطة الألوان',
    icon: 'door',
    lang: 'ar',
    paragraphs: [
      'كانت سلمى تزور مدينة فاس القديمة لأول مرة مع عمّتها. الأزقة ضيقة ومتعرّجة، والأبواب الخشبية متشابهة، والناس يمرّون مسرعين يحملون السلال والأقمشة.',
      'توقفت سلمى لتنظر إلى دكان يبيع الفوانيس النحاسية، وحين التفتت لم تجد عمّتها. كانت الأزقة كلها تبدو متشابهة، وشعرت بقلبها يدقّ بسرعة.',
      'تذكّرت ما قالته عمّتها في الصباح: إذا ضعتِ، فاتبعي الألوان. نظرت سلمى حولها بهدوء، فرأت زقاق الصبّاغين حيث تتدلّى الأقمشة الحمراء والخضراء، وتذكّرت أنهما مرّتا به قبل قليل.',
      'مشت سلمى من الأحمر إلى الأخضر، ثم إلى الباب الأزرق ذي المسامير النحاسية، ثم إلى نافورة الزليج الملوّن التي شربتا منها الماء.',
      'وهناك، بجانب النافورة، كانت عمّتها تنتظرها مبتسمة. ضمّتها وقالت: أرأيتِ؟ المدينة ليست متاهة لمن يعرف كيف ينظر. ومنذ ذلك اليوم، صارت سلمى ترى في كل لون علامة تدلّها على الطريق.'
    ]
  }
];
