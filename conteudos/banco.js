'use strict';
// Banco publicado do Missão 803, conciliado na auditoria de 20/11/2026. Revisão pedagógica pendente.
const questoes = [
  {
    "id": "4c3131624ad30c1d",
    "materia": "Arte",
    "assunto": "Elementos visuais",
    "pergunta": "Quais elementos ajudam a construir uma composição visual?",
    "alternativas": [
      "Linha, forma, cor e textura",
      "Somente números",
      "Apenas regras gramaticais",
      "Somente operações matemáticas"
    ],
    "correta": 0,
    "explicacao": "A arte visual combina elementos como linhas, formas, cores, luz, espaço e textura."
  },
  {
    "id": "a172e103fba7b4b3",
    "materia": "Arte",
    "assunto": "Elementos visuais",
    "pergunta": "Em artes visuais, textura se relaciona principalmente à:",
    "alternativas": [
      "Qualidade aparente ou tátil de uma superfície",
      "Altura de uma nota musical",
      "Duração de um filme",
      "Área de um gráfico"
    ],
    "correta": 0,
    "explicacao": "Texturas podem ser percebidas pelo toque ou visualmente."
  },
  {
    "id": "cd2ab9d0c22305b2",
    "materia": "Arte",
    "assunto": "Cores",
    "pergunta": "Quais são as cores primárias tradicionais na pintura escolar?",
    "alternativas": [
      "Vermelho, amarelo e azul",
      "Verde, roxo e laranja",
      "Preto, branco e cinza",
      "Azul, verde e roxo"
    ],
    "correta": 0,
    "explicacao": "Na teoria tradicional de pigmentos escolares, vermelho, amarelo e azul são cores primárias."
  },
  {
    "id": "d1623aff8c7e2f58",
    "materia": "Arte",
    "assunto": "Cores",
    "pergunta": "O contraste de cores pode ser usado em um cartaz para:",
    "alternativas": [
      "Destacar informações importantes",
      "Impedir totalmente a leitura",
      "Eliminar a hierarquia visual",
      "Substituir todo texto obrigatoriamente"
    ],
    "correta": 0,
    "explicacao": "Contraste orienta atenção e ajuda a diferenciar elementos."
  },
  {
    "id": "e176ac432e53a929",
    "materia": "Arte",
    "assunto": "História da arte",
    "pergunta": "O Renascimento europeu valorizou, entre outras coisas:",
    "alternativas": [
      "Estudos de proporção e perspectiva",
      "A proibição da representação humana",
      "Somente formas digitais",
      "A ausência de experimentação"
    ],
    "correta": 0,
    "explicacao": "Artistas renascentistas exploraram anatomia, observação e perspectiva."
  },
  {
    "id": "4e5fd21f707f42aa",
    "materia": "Arte",
    "assunto": "História da arte",
    "pergunta": "O Impressionismo buscou representar especialmente:",
    "alternativas": [
      "Efeitos de luz e impressões visuais",
      "Somente mapas políticos",
      "Fórmulas algébricas",
      "Exclusivamente ícones digitais"
    ],
    "correta": 0,
    "explicacao": "Pintores impressionistas exploraram luz, cor e atmosferas."
  },
  {
    "id": "ec9bce1967bcf122",
    "materia": "Arte",
    "assunto": "História da arte",
    "pergunta": "Uma característica frequente do Cubismo é:",
    "alternativas": [
      "Representação por formas geométricas e múltiplos pontos de vista",
      "Uso obrigatório de fotografias realistas",
      "Ausência de experimentação formal",
      "Somente cores primárias"
    ],
    "correta": 0,
    "explicacao": "O Cubismo rompeu com a representação única e explorou a geometrização."
  },
  {
    "id": "87fdc0279b486e54",
    "materia": "Arte",
    "assunto": "Arte brasileira",
    "pergunta": "Quem pintou a obra \"Abaporu\"?",
    "alternativas": [
      "Tarsila do Amaral",
      "Anita Malfatti como única autora",
      "Cândido Portinari",
      "Alfredo Volpi"
    ],
    "correta": 0,
    "explicacao": "Tarsila do Amaral criou Abaporu em 1928."
  },
  {
    "id": "d0e2258e64752240",
    "materia": "Arte",
    "assunto": "Arte brasileira",
    "pergunta": "A Semana de Arte Moderna aconteceu em São Paulo em:",
    "alternativas": [
      "1922",
      "1822",
      "1888",
      "1964"
    ],
    "correta": 0,
    "explicacao": "O evento de 1922 tornou-se um marco do modernismo brasileiro."
  },
  {
    "id": "00ab8c8c9a528f61",
    "materia": "Arte",
    "assunto": "Arte brasileira",
    "pergunta": "Uma manifestação de arte popular brasileira pode envolver:",
    "alternativas": [
      "Expressões culturais diversas como cordel e xilogravura",
      "Somente obras de museus europeus",
      "Exclusivamente produções industriais",
      "Somente arte digital"
    ],
    "correta": 0,
    "explicacao": "A arte popular reúne formas variadas de expressão e saberes culturais."
  },
  {
    "id": "52318294ae6e594d",
    "materia": "Arte",
    "assunto": "Arte indígena",
    "pergunta": "As produções artísticas indígenas brasileiras devem ser compreendidas como:",
    "alternativas": [
      "Expressões diversas de povos com histórias e tradições próprias",
      "Uma única arte idêntica para todos os povos",
      "Apenas objetos sem significado",
      "Manifestações desaparecidas"
    ],
    "correta": 0,
    "explicacao": "Não existe uma só cultura indígena; as expressões são diversas e contemporâneas."
  },
  {
    "id": "d4331b280c00884a",
    "materia": "Arte",
    "assunto": "Arte afro-brasileira",
    "pergunta": "A arte afro-brasileira expressa:",
    "alternativas": [
      "Experiências, matrizes e referências culturais diversas",
      "Uma única linguagem sem variação",
      "Apenas arte produzida fora do Brasil",
      "Ausência de influências históricas"
    ],
    "correta": 0,
    "explicacao": "A produção afro-brasileira é ampla e relaciona identidades, histórias e linguagens."
  },
  {
    "id": "73edbc242e28b9e4",
    "materia": "Arte",
    "assunto": "Música",
    "pergunta": "O que é ritmo em uma composição musical?",
    "alternativas": [
      "Organização temporal de sons e silêncios",
      "Somente volume máximo",
      "A cor do instrumento",
      "A posição do palco"
    ],
    "correta": 0,
    "explicacao": "Ritmo envolve durações, padrões e acentos."
  },
  {
    "id": "6156401863a5b5d3",
    "materia": "Arte",
    "assunto": "Música",
    "pergunta": "Qual termo indica a velocidade de execução de uma música?",
    "alternativas": [
      "Andamento",
      "Matiz",
      "Perspectiva",
      "Textura tátil"
    ],
    "correta": 0,
    "explicacao": "O andamento se relaciona à rapidez das pulsações musicais."
  },
  {
    "id": "901e619a96836e6c",
    "materia": "Arte",
    "assunto": "Música",
    "pergunta": "O timbre permite distinguir:",
    "alternativas": [
      "Fontes sonoras com características diferentes",
      "Somente a duração da música",
      "A área da sala",
      "A distância entre cidades"
    ],
    "correta": 0,
    "explicacao": "Timbre é a qualidade que diferencia fontes sonoras além da altura e intensidade."
  },
  {
    "id": "ffd9324b1cdabe81",
    "materia": "Arte",
    "assunto": "Música",
    "pergunta": "Um arranjo musical pode modificar:",
    "alternativas": [
      "Instrumentação e organização das partes de uma obra",
      "Somente seu título",
      "A data de nascimento do compositor",
      "A forma do palco obrigatoriamente"
    ],
    "correta": 0,
    "explicacao": "Arranjos podem alterar instrumentos, acompanhamento e texturas musicais."
  },
  {
    "id": "d8fed335c401d52c",
    "materia": "Arte",
    "assunto": "Teatro",
    "pergunta": "No teatro, a cenografia contribui para:",
    "alternativas": [
      "Construir o espaço e a atmosfera cênica",
      "Substituir obrigatoriamente os atores",
      "Determinar as notas musicais",
      "Resolver equações"
    ],
    "correta": 0,
    "explicacao": "Cenografia ajuda a situar a ação e reforçar sentidos dramáticos."
  },
  {
    "id": "817c1d957457d091",
    "materia": "Arte",
    "assunto": "Teatro",
    "pergunta": "O improviso teatral envolve:",
    "alternativas": [
      "Criar ações e diálogos sem roteiro totalmente fixo",
      "Repetir apenas um texto decorado",
      "Evitar interação entre pessoas",
      "Usar apenas instrumentos"
    ],
    "correta": 0,
    "explicacao": "Improvisação permite respostas criativas durante uma cena."
  },
  {
    "id": "e8956f0d999a1032",
    "materia": "Arte",
    "assunto": "Teatro",
    "pergunta": "A expressão corporal ajuda o ator a:",
    "alternativas": [
      "Comunicar sentimentos e ideias pelo movimento",
      "Eliminar toda comunicação",
      "Substituir toda fala por números",
      "Dispensar presença cênica"
    ],
    "correta": 0,
    "explicacao": "Corpo, gesto e postura são recursos de expressão teatral."
  },
  {
    "id": "fda07ef1fe6211f4",
    "materia": "Arte",
    "assunto": "Dança",
    "pergunta": "Na dança, o espaço refere-se a:",
    "alternativas": [
      "Direções, níveis e trajetórias dos movimentos",
      "Somente a cor do figurino",
      "Apenas o número de espectadores",
      "A duração da iluminação"
    ],
    "correta": 0,
    "explicacao": "A composição coreográfica considera deslocamentos e ocupação do espaço."
  },
  {
    "id": "62494baea9aa9a54",
    "materia": "Arte",
    "assunto": "Dança",
    "pergunta": "Uma coreografia pode organizar:",
    "alternativas": [
      "Movimentos, tempo e relações entre participantes",
      "Apenas fórmulas matemáticas",
      "Somente a sequência de páginas",
      "Exclusivamente palavras escritas"
    ],
    "correta": 0,
    "explicacao": "Coreografia articula escolhas de movimento, ritmo, espaço e interação."
  },
  {
    "id": "0e981d0edeefa966",
    "materia": "Arte",
    "assunto": "Audiovisual",
    "pergunta": "Qual é a função da montagem em um filme?",
    "alternativas": [
      "Organizar planos e criar relações de sentido",
      "Aumentar obrigatoriamente o orçamento",
      "Substituir o som por silêncio sempre",
      "Eliminar a câmera"
    ],
    "correta": 0,
    "explicacao": "Montagem organiza imagens e sons em uma narrativa audiovisual."
  },
  {
    "id": "8e1cb4fe4c145b2a",
    "materia": "Arte",
    "assunto": "Fotografia",
    "pergunta": "O enquadramento fotográfico é uma escolha sobre:",
    "alternativas": [
      "O que aparece e como aparece na imagem",
      "Qual é a nota musical principal",
      "A idade exata de todo observador",
      "O preço do equipamento"
    ],
    "correta": 0,
    "explicacao": "Enquadrar envolve selecionar limites, ângulo e composição da imagem."
  },
  {
    "id": "b4b3b9540ed016e4",
    "materia": "Arte",
    "assunto": "Arte digital",
    "pergunta": "Arte digital pode ser produzida por meio de:",
    "alternativas": [
      "Ferramentas computacionais e processos criativos",
      "Somente pincéis de madeira",
      "Exclusivamente esculturas de pedra",
      "Apenas câmeras analógicas"
    ],
    "correta": 0,
    "explicacao": "Artistas usam meios digitais para compor, editar e explorar linguagens."
  },
  {
    "id": "872bdb708269de5c",
    "materia": "Arte",
    "assunto": "Leitura de imagens",
    "pergunta": "Ao analisar uma obra de arte, é importante considerar:",
    "alternativas": [
      "Elementos visuais, contexto e possíveis interpretações",
      "Somente seu tamanho",
      "Apenas seu preço",
      "Exclusivamente o tipo de moldura"
    ],
    "correta": 0,
    "explicacao": "Obras podem ser lidas a partir de materiais, contextos e escolhas de linguagem."
  },
  {
    "id": "4001c8bfa82dfa04",
    "materia": "Arte",
    "assunto": "Arte e patrimônio",
    "pergunta": "Patrimônio cultural imaterial abrange:",
    "alternativas": [
      "Saberes, celebrações e práticas culturais",
      "Apenas edifícios de concreto",
      "Somente carros antigos",
      "Somente moedas"
    ],
    "correta": 0,
    "explicacao": "O patrimônio imaterial inclui formas de expressão e conhecimentos coletivos."
  },
  {
    "id": "81d85fad2382bbfa",
    "materia": "Arte",
    "assunto": "Arte e respeito",
    "pergunta": "Uma atitude adequada ao estudar manifestações de diferentes culturas é:",
    "alternativas": [
      "Ouvir suas comunidades e respeitar seus contextos",
      "Reduzir todas à mesma origem",
      "Ridicularizar diferenças",
      "Ignorar autoria e história"
    ],
    "correta": 0,
    "explicacao": "O respeito cultural requer contexto, autoria e escuta."
  },
  {
    "id": "f305109f30843c4e",
    "materia": "Ciências",
    "assunto": "Energia",
    "pergunta": "Qual unidade do Sistema Internacional mede energia?",
    "alternativas": [
      "Joule",
      "Watt",
      "Newton",
      "Ampere"
    ],
    "correta": 0,
    "explicacao": "O joule (J) mede energia; o watt (W) mede potência."
  },
  {
    "id": "ca57927de9453118",
    "materia": "Ciências",
    "assunto": "Energia elétrica",
    "pergunta": "Qual aparelho transforma energia elétrica principalmente em térmica?",
    "alternativas": [
      "Chuveiro elétrico",
      "Ventilador",
      "Painel fotovoltaico",
      "Bicicleta"
    ],
    "correta": 0,
    "explicacao": "O chuveiro usa uma resistência para aquecer a água."
  },
  {
    "id": "00042c5b699305ac",
    "materia": "Ciências",
    "assunto": "Energia elétrica",
    "pergunta": "Qual unidade mede potência elétrica?",
    "alternativas": [
      "Watt",
      "Joule",
      "Kelvin",
      "Metro"
    ],
    "correta": 0,
    "explicacao": "Potência mede a taxa de transformação de energia."
  },
  {
    "id": "69513a0b9e03e971",
    "materia": "Ciências",
    "assunto": "Circuitos elétricos",
    "pergunta": "Para uma lâmpada acender em um circuito simples, ele precisa estar:",
    "alternativas": [
      "Fechado, permitindo a passagem de corrente",
      "Sempre aberto",
      "Sem fonte de energia",
      "Sem conexões"
    ],
    "correta": 0,
    "explicacao": "Um circuito fechado permite a circulação de corrente elétrica."
  },
  {
    "id": "0edce0aa9299451b",
    "materia": "Ciências",
    "assunto": "Circuitos elétricos",
    "pergunta": "Qual material costuma conduzir corrente elétrica com facilidade?",
    "alternativas": [
      "Cobre",
      "Borracha seca",
      "Vidro",
      "Plástico"
    ],
    "correta": 0,
    "explicacao": "Metais como o cobre são bons condutores."
  },
  {
    "id": "6defa77456d7606d",
    "materia": "Ciências",
    "assunto": "Circuitos elétricos",
    "pergunta": "Em uma ligação em série, se uma lâmpada interrompe o circuito, as demais geralmente:",
    "alternativas": [
      "Apagam",
      "Brilham mais sem alteração",
      "Continuam idênticas",
      "Acendem sem fonte"
    ],
    "correta": 0,
    "explicacao": "Todos os componentes em série compartilham um único caminho de corrente."
  },
  {
    "id": "27d46034e22d8174",
    "materia": "Ciências",
    "assunto": "Circuitos elétricos",
    "pergunta": "Em circuitos em paralelo, os ramos possuem:",
    "alternativas": [
      "Caminhos distintos para a corrente",
      "Sempre um único caminho",
      "Apenas um componente",
      "Ausência de tensão"
    ],
    "correta": 0,
    "explicacao": "Na ligação em paralelo, existem caminhos independentes."
  },
  {
    "id": "c5948d7f8a7bdc13",
    "materia": "Ciências",
    "assunto": "Consumo de energia",
    "pergunta": "Uma lâmpada de 100 W ligada por 10 horas consome:",
    "alternativas": [
      "1 kWh",
      "10 kWh",
      "100 kWh",
      "0,1 kWh"
    ],
    "correta": 0,
    "explicacao": "100 W = 0,1 kW; 0,1 × 10 h = 1 kWh."
  },
  {
    "id": "32cec0a3e1520e35",
    "materia": "Ciências",
    "assunto": "Uso consciente de energia",
    "pergunta": "Uma medida de economia de energia é:",
    "alternativas": [
      "Apagar lâmpadas desnecessárias",
      "Deixar aparelhos ligados sem uso",
      "Manter a geladeira aberta",
      "Usar aparelhos danificados"
    ],
    "correta": 0,
    "explicacao": "Reduzir desperdícios ajuda a diminuir consumo e custos."
  },
  {
    "id": "ccfbacd2242af67d",
    "materia": "Ciências",
    "assunto": "Fontes de energia",
    "pergunta": "Qual fonte é renovável na escala humana?",
    "alternativas": [
      "Energia solar",
      "Carvão mineral",
      "Petróleo",
      "Gás natural"
    ],
    "correta": 0,
    "explicacao": "A energia solar é disponibilizada continuamente pelo Sol."
  },
  {
    "id": "5185b287b6f9b300",
    "materia": "Ciências",
    "assunto": "Fontes de energia",
    "pergunta": "Qual fonte envolve a queima de combustível fóssil?",
    "alternativas": [
      "Carvão mineral",
      "Vento",
      "Luz solar",
      "Movimento das marés"
    ],
    "correta": 0,
    "explicacao": "O carvão mineral é combustível fóssil."
  },
  {
    "id": "063413db172dda1d",
    "materia": "Ciências",
    "assunto": "Reprodução",
    "pergunta": "O que caracteriza a reprodução sexuada?",
    "alternativas": [
      "Combinação de material genético de gametas",
      "Ausência de material genético",
      "Sempre formação de clones",
      "Uma célula se dividindo sem troca genética"
    ],
    "correta": 0,
    "explicacao": "A reprodução sexuada combina material genético e aumenta a variabilidade."
  },
  {
    "id": "c5788bdc1b86a684",
    "materia": "Ciências",
    "assunto": "Reprodução",
    "pergunta": "Na reprodução assexuada, em condições comuns, descendentes tendem a ser:",
    "alternativas": [
      "Geneticamente muito semelhantes ao organismo de origem",
      "Sempre de outra espécie",
      "Sem DNA",
      "Sempre completamente diferentes"
    ],
    "correta": 0,
    "explicacao": "A reprodução assexuada geralmente preserva a informação genética do organismo de origem."
  },
  {
    "id": "118215ab59081edf",
    "materia": "Ciências",
    "assunto": "Puberdade",
    "pergunta": "A puberdade envolve:",
    "alternativas": [
      "Mudanças corporais e hormonais durante o desenvolvimento",
      "Um processo idêntico para todos",
      "A interrupção do crescimento do cérebro",
      "Mudanças apenas no cabelo"
    ],
    "correta": 0,
    "explicacao": "O ritmo e as características do desenvolvimento variam de pessoa para pessoa."
  },
  {
    "id": "9caf22c047990702",
    "materia": "Ciências",
    "assunto": "Hormônios",
    "pergunta": "As glândulas endócrinas liberam substâncias chamadas:",
    "alternativas": [
      "Hormônios",
      "Antibióticos",
      "Vitaminas obrigatórias",
      "Neurônios"
    ],
    "correta": 0,
    "explicacao": "Hormônios atuam como mensageiros químicos no organismo."
  },
  {
    "id": "c607d30d2d6b0399",
    "materia": "Ciências",
    "assunto": "Saúde e prevenção",
    "pergunta": "Qual atitude contribui para a prevenção de infecções?",
    "alternativas": [
      "Acessar informação confiável e seguir orientações de saúde",
      "Compartilhar boatos",
      "Ignorar medidas de prevenção",
      "Evitar orientações de profissionais"
    ],
    "correta": 0,
    "explicacao": "A prevenção depende de informação e cuidados adequados a cada situação."
  },
  {
    "id": "0f655f1c3cd74c18",
    "materia": "Ciências",
    "assunto": "Saúde e prevenção",
    "pergunta": "Por que a vacinação tem importância coletiva?",
    "alternativas": [
      "Ajuda a reduzir a circulação de agentes infecciosos",
      "Substitui toda forma de higiene",
      "Elimina necessidade de informações",
      "Atua como antibiótico universal"
    ],
    "correta": 0,
    "explicacao": "A vacinação pode proteger indivíduos e ajudar a reduzir a transmissão de determinadas doenças."
  },
  {
    "id": "8ec921961ca16cd4",
    "materia": "Ciências",
    "assunto": "Terra e Lua",
    "pergunta": "Qual fenômeno explica as fases da Lua?",
    "alternativas": [
      "Mudanças na parte iluminada visível da Terra",
      "Mudanças no tamanho real da Lua",
      "A Lua produzir luz própria",
      "A sombra da Terra cobrir a Lua todo mês"
    ],
    "correta": 0,
    "explicacao": "A Lua reflete luz solar, e vemos diferentes partes iluminadas ao longo da órbita."
  },
  {
    "id": "696f8737fc513b76",
    "materia": "Ciências",
    "assunto": "Terra e Lua",
    "pergunta": "Um eclipse lunar acontece quando:",
    "alternativas": [
      "A Terra fica entre o Sol e a Lua e projeta sombra nela",
      "A Lua fica entre Sol e Terra sempre ao meio-dia",
      "A Lua muda de tamanho",
      "O Sol desaparece"
    ],
    "correta": 0,
    "explicacao": "O eclipse lunar depende do alinhamento dos três astros."
  },
  {
    "id": "b939da704d51aa88",
    "materia": "Ciências",
    "assunto": "Terra e Lua",
    "pergunta": "Um eclipse solar pode acontecer quando:",
    "alternativas": [
      "A Lua fica entre o Sol e a Terra",
      "A Terra fica entre o Sol e a Lua",
      "A Lua interrompe sua rotação",
      "O Sol gira ao redor da Terra"
    ],
    "correta": 0,
    "explicacao": "Em um eclipse solar a Lua pode ocultar o Sol na perspectiva de observadores na Terra."
  },
  {
    "id": "d0958bc629c9eb97",
    "materia": "Ciências",
    "assunto": "Estações do ano",
    "pergunta": "A principal causa das estações do ano é:",
    "alternativas": [
      "A inclinação do eixo terrestre e o movimento de translação",
      "Apenas a distância da Terra ao Sol",
      "As fases da Lua",
      "A duração das marés"
    ],
    "correta": 0,
    "explicacao": "A inclinação altera a distribuição da luz solar ao longo do ano."
  },
  {
    "id": "90193ebb2f158d9d",
    "materia": "Ciências",
    "assunto": "Clima e tempo",
    "pergunta": "Tempo atmosférico refere-se a:",
    "alternativas": [
      "Condições da atmosfera em um momento e lugar",
      "Média de longo período apenas",
      "Somente à temperatura do solo",
      "Ao horário do relógio"
    ],
    "correta": 0,
    "explicacao": "O tempo muda de um momento a outro; clima envolve padrões de longo prazo."
  },
  {
    "id": "ee5baa100191fde0",
    "materia": "Ciências",
    "assunto": "Meteorologia",
    "pergunta": "Qual aparelho mede a pressão atmosférica?",
    "alternativas": [
      "Barômetro",
      "Termômetro",
      "Pluviômetro",
      "Higrômetro"
    ],
    "correta": 0,
    "explicacao": "O barômetro mede a pressão do ar."
  },
  {
    "id": "f8c5f5919b93eab3",
    "materia": "Ciências",
    "assunto": "Meteorologia",
    "pergunta": "Qual aparelho mede a quantidade de chuva?",
    "alternativas": [
      "Pluviômetro",
      "Anemômetro",
      "Barômetro",
      "Bússola"
    ],
    "correta": 0,
    "explicacao": "O pluviômetro registra a precipitação."
  },
  {
    "id": "316667f7df65cdb3",
    "materia": "Ciências",
    "assunto": "Meteorologia",
    "pergunta": "Qual instrumento registra a velocidade do vento?",
    "alternativas": [
      "Anemômetro",
      "Pluviômetro",
      "Barômetro",
      "Termômetro"
    ],
    "correta": 0,
    "explicacao": "O anemômetro mede velocidade do vento."
  },
  {
    "id": "305c18e39898bed4",
    "materia": "Ciências",
    "assunto": "Mudanças climáticas",
    "pergunta": "O aquecimento global recente relaciona-se principalmente ao aumento de:",
    "alternativas": [
      "Gases de efeito estufa de origem humana",
      "Ondas sonoras do espaço",
      "Marés lunares diárias",
      "Mudanças no tamanho da Lua"
    ],
    "correta": 0,
    "explicacao": "A maior concentração desses gases intensifica a retenção de calor na atmosfera."
  },
  {
    "id": "ac0e2971a55cf74b",
    "materia": "Ciências",
    "assunto": "Biodiversidade",
    "pergunta": "A diversidade de espécies em um ecossistema favorece:",
    "alternativas": [
      "O funcionamento das redes ecológicas",
      "A eliminação de toda cadeia alimentar",
      "A ausência de relações ecológicas",
      "A extinção automática de predadores"
    ],
    "correta": 0,
    "explicacao": "A biodiversidade sustenta relações importantes para o funcionamento dos ecossistemas."
  },
  {
    "id": "9a7ddb1dd8ea6c11",
    "materia": "Ciências",
    "assunto": "Sustentabilidade",
    "pergunta": "Qual prática ajuda a reduzir a geração de resíduos?",
    "alternativas": [
      "Reutilizar materiais quando possível",
      "Descartar todos os produtos após um uso",
      "Misturar todo resíduo sem separação",
      "Queimar plástico ao ar livre"
    ],
    "correta": 0,
    "explicacao": "Reduzir, reutilizar e reciclar pode diminuir impactos ambientais."
  },
  {
    "id": "618aa9a80c641b10",
    "materia": "Ciências",
    "assunto": "Células",
    "pergunta": "Qual estrutura contém a maior parte do DNA de uma célula humana?",
    "alternativas": [
      "Núcleo",
      "Parede celular",
      "Cloroplasto",
      "Vacúolo central"
    ],
    "correta": 0,
    "explicacao": "Em células humanas eucarióticas, a maior parte do DNA fica no núcleo."
  },
  {
    "id": "8519a75357525197",
    "materia": "Ciências",
    "assunto": "Ecologia",
    "pergunta": "Os produtores de uma cadeia alimentar são, em geral:",
    "alternativas": [
      "Organismos autotróficos como plantas",
      "Apenas consumidores secundários",
      "Somente fungos decompositores",
      "Animais carnívoros obrigatoriamente"
    ],
    "correta": 0,
    "explicacao": "Produtores fabricam matéria orgânica, muitas vezes por fotossíntese."
  },
  {
    "id": "2af55be08071abd3",
    "materia": "Ciências",
    "assunto": "Sistema nervoso",
    "pergunta": "Qual é a função básica dos neurônios?",
    "alternativas": [
      "Receber e transmitir informações por sinais",
      "Produzir hemácias",
      "Armazenar a maior parte do cálcio ósseo",
      "Formar esmalte dentário"
    ],
    "correta": 0,
    "explicacao": "Neurônios participam da transmissão de sinais no sistema nervoso."
  },
  {
    "id": "61b19530b4fd2d88",
    "materia": "Ciências",
    "assunto": "Ciência e tecnologia",
    "pergunta": "Por que comparar fontes científicas é importante?",
    "alternativas": [
      "Para verificar evidências e evitar conclusões precipitadas",
      "Para escolher a informação mais alarmante",
      "Para dispensar métodos",
      "Para ignorar resultados contrários"
    ],
    "correta": 0,
    "explicacao": "A avaliação de métodos e evidências torna conclusões mais confiáveis."
  },
  {
    "id": "3a32b2c6837a93aa",
    "materia": "Língua Portuguesa",
    "assunto": "Compreensão textual",
    "pergunta": "Qual ação ajuda a identificar a ideia central de um texto?",
    "alternativas": [
      "Observar o tema e as informações principais",
      "Ler apenas a última palavra",
      "Ignorar o título",
      "Contar somente as vírgulas"
    ],
    "correta": 0,
    "explicacao": "A ideia central resume o assunto desenvolvido no texto."
  },
  {
    "id": "932e8b795a97923b",
    "materia": "Língua Portuguesa",
    "assunto": "Fato e opinião",
    "pergunta": "Qual frase apresenta uma opinião?",
    "alternativas": [
      "A apresentação foi interessante.",
      "A aula começou às 8h.",
      "O livro tem 120 páginas.",
      "A sala possui duas janelas."
    ],
    "correta": 0,
    "explicacao": "Opiniões exprimem avaliações pessoais; fatos podem ser verificados."
  },
  {
    "id": "3be7648d9ce79a13",
    "materia": "Língua Portuguesa",
    "assunto": "Argumentação",
    "pergunta": "Em um texto argumentativo, o que é tese?",
    "alternativas": [
      "A posição defendida pelo autor",
      "A lista de personagens",
      "O local da narrativa",
      "A data de publicação"
    ],
    "correta": 0,
    "explicacao": "Tese é a ideia central que o autor sustenta com argumentos."
  },
  {
    "id": "3d1cbfe903ef9823",
    "materia": "Língua Portuguesa",
    "assunto": "Argumentação",
    "pergunta": "Qual alternativa apresenta uma justificativa para uma tese?",
    "alternativas": [
      "Porque a leitura amplia o vocabulário",
      "Ontem depois da aula",
      "Era uma vez um reino",
      "Quem escreveu?"
    ],
    "correta": 0,
    "explicacao": "Um argumento apresenta razões, exemplos ou dados que sustentam a posição."
  },
  {
    "id": "c3daab2e1651ca1a",
    "materia": "Língua Portuguesa",
    "assunto": "Argumentação",
    "pergunta": "Qual é a função de um contra-argumento?",
    "alternativas": [
      "Apresentar e discutir uma ideia contrária",
      "Substituir toda conclusão",
      "Eliminar o tema",
      "Acrescentar rimas"
    ],
    "correta": 0,
    "explicacao": "Contra-argumentar é considerar e responder a outras perspectivas."
  },
  {
    "id": "33148208fe9c4723",
    "materia": "Língua Portuguesa",
    "assunto": "Gêneros jornalísticos",
    "pergunta": "Uma notícia deve priorizar:",
    "alternativas": [
      "Informações verificáveis sobre acontecimentos",
      "Somente opiniões pessoais",
      "Versos com rima",
      "Instruções de receita"
    ],
    "correta": 0,
    "explicacao": "Notícias informam fatos apurados, contextualizados e verificáveis."
  },
  {
    "id": "e8abd6122192bd67",
    "materia": "Língua Portuguesa",
    "assunto": "Gêneros jornalísticos",
    "pergunta": "O objetivo principal de um editorial é:",
    "alternativas": [
      "Expressar a posição do veículo sobre um tema",
      "Apresentar uma receita",
      "Narrar um conto infantil",
      "Informar o significado de uma palavra"
    ],
    "correta": 0,
    "explicacao": "O editorial apresenta o ponto de vista institucional de um veículo."
  },
  {
    "id": "017b0a49efdbba34",
    "materia": "Língua Portuguesa",
    "assunto": "Publicidade",
    "pergunta": "Na publicidade, uma frase persuasiva procura:",
    "alternativas": [
      "Influenciar escolhas do público",
      "Medir a temperatura",
      "Registrar coordenadas",
      "Explicar uma equação"
    ],
    "correta": 0,
    "explicacao": "A linguagem publicitária pode incentivar escolhas e ações."
  },
  {
    "id": "7ccea2659320aad5",
    "materia": "Língua Portuguesa",
    "assunto": "Coesão textual",
    "pergunta": "Qual conectivo indica oposição?",
    "alternativas": [
      "Entretanto",
      "Portanto",
      "Porque",
      "Além disso"
    ],
    "correta": 0,
    "explicacao": "Entretanto introduz contraste entre ideias."
  },
  {
    "id": "42f2b7bda2ef6128",
    "materia": "Língua Portuguesa",
    "assunto": "Coesão textual",
    "pergunta": "Qual conectivo indica conclusão?",
    "alternativas": [
      "Portanto",
      "Embora",
      "Enquanto",
      "Porém"
    ],
    "correta": 0,
    "explicacao": "Portanto normalmente introduz resultado ou conclusão."
  },
  {
    "id": "6cfd6adc2ee605b6",
    "materia": "Língua Portuguesa",
    "assunto": "Coesão textual",
    "pergunta": "Qual conectivo indica causa?",
    "alternativas": [
      "Porque",
      "Contudo",
      "Entretanto",
      "Todavia"
    ],
    "correta": 0,
    "explicacao": "Porque apresenta motivo ou justificativa."
  },
  {
    "id": "3004d2cff68a336a",
    "materia": "Língua Portuguesa",
    "assunto": "Coerência",
    "pergunta": "Um texto coerente deve apresentar:",
    "alternativas": [
      "Ideias relacionadas de forma lógica",
      "Palavras colocadas aleatoriamente",
      "Frases sem conexão",
      "Somente listas de números"
    ],
    "correta": 0,
    "explicacao": "Coerência envolve sentido global e relações compreensíveis entre ideias."
  },
  {
    "id": "dc2633dd65ea545b",
    "materia": "Língua Portuguesa",
    "assunto": "Pontuação",
    "pergunta": "Qual pontuação costuma introduzir a fala direta de um personagem em narrativa?",
    "alternativas": [
      "Travessão",
      "Ponto e vírgula",
      "Parênteses obrigatórios",
      "Barra vertical"
    ],
    "correta": 0,
    "explicacao": "O travessão é empregado em muitos diálogos para indicar fala direta."
  },
  {
    "id": "735ee27bc1dcb6c2",
    "materia": "Língua Portuguesa",
    "assunto": "Pontuação",
    "pergunta": "Em uma enumeração simples, usamos frequentemente:",
    "alternativas": [
      "Vírgulas",
      "Pontos finais entre cada item",
      "Asteriscos obrigatórios",
      "Dois travessões"
    ],
    "correta": 0,
    "explicacao": "Vírgulas separam itens coordenados em uma enumeração."
  },
  {
    "id": "9293b66b787ac330",
    "materia": "Língua Portuguesa",
    "assunto": "Verbos",
    "pergunta": "Em \"Eles estudaram ontem\", o verbo está no:",
    "alternativas": [
      "Pretérito perfeito do indicativo",
      "Futuro do presente",
      "Presente do subjuntivo",
      "Infinitivo"
    ],
    "correta": 0,
    "explicacao": "Estudaram expressa ação concluída no passado."
  },
  {
    "id": "d4e2294d7636a7a0",
    "materia": "Língua Portuguesa",
    "assunto": "Verbos",
    "pergunta": "Em \"Se eu pudesse, viajaria\", a forma \"pudesse\" está no:",
    "alternativas": [
      "Pretérito imperfeito do subjuntivo",
      "Presente do indicativo",
      "Imperativo afirmativo",
      "Futuro do presente"
    ],
    "correta": 0,
    "explicacao": "Pudesse expressa hipótese no pretérito imperfeito do subjuntivo."
  },
  {
    "id": "4b95c0e64c566d55",
    "materia": "Língua Portuguesa",
    "assunto": "Regência verbal",
    "pergunta": "Qual é uma construção adequada na norma-padrão formal de \"assistir\" com sentido de ver?",
    "alternativas": [
      "Assisti ao filme.",
      "Assisti pelo filme.",
      "Assisti no filme.",
      "Assisti para o filme."
    ],
    "correta": 0,
    "explicacao": "Na norma-padrão, assistir no sentido de ver costuma reger preposição a."
  },
  {
    "id": "b4fa6412d5a8fd6b",
    "materia": "Língua Portuguesa",
    "assunto": "Regência nominal",
    "pergunta": "Qual complemento apresenta regência usual com o adjetivo \"favorável\"?",
    "alternativas": [
      "Favorável à proposta",
      "Favorável da proposta",
      "Favorável pela proposta apenas",
      "Favorável sob proposta"
    ],
    "correta": 0,
    "explicacao": "O adjetivo favorável rege a preposição a nesse contexto."
  },
  {
    "id": "e55834c2f2e8104b",
    "materia": "Língua Portuguesa",
    "assunto": "Concordância",
    "pergunta": "Qual frase respeita a concordância verbal?",
    "alternativas": [
      "Os alunos chegaram cedo.",
      "Os alunos chegou cedo.",
      "Os aluno chegaram cedo.",
      "A turma chegaram cedo."
    ],
    "correta": 0,
    "explicacao": "O verbo concorda com o núcleo plural do sujeito: alunos chegaram."
  },
  {
    "id": "933adc4343dd44a5",
    "materia": "Língua Portuguesa",
    "assunto": "Concordância",
    "pergunta": "Qual frase apresenta concordância nominal adequada?",
    "alternativas": [
      "As propostas interessantes foram aprovadas.",
      "As proposta interessantes foi aprovada.",
      "Os propostas interessante foram aprovados.",
      "As propostas interessante foi aprovado."
    ],
    "correta": 0,
    "explicacao": "Determinantes e adjetivos acompanham gênero e número do substantivo."
  },
  {
    "id": "2cdf053ed72faf4f",
    "materia": "Língua Portuguesa",
    "assunto": "Vozes verbais",
    "pergunta": "Qual oração está na voz passiva analítica?",
    "alternativas": [
      "A carta foi escrita pela estudante.",
      "A estudante escreveu a carta.",
      "Ela escreve bem.",
      "Escreva a carta!"
    ],
    "correta": 0,
    "explicacao": "A voz passiva analítica usa verbo auxiliar com particípio."
  },
  {
    "id": "29f6614341fa5ae5",
    "materia": "Língua Portuguesa",
    "assunto": "Orações",
    "pergunta": "Em \"Estudei porque tinha prova\", a segunda oração expressa:",
    "alternativas": [
      "Causa",
      "Condição",
      "Concessão",
      "Comparação"
    ],
    "correta": 0,
    "explicacao": "A oração introduzida por porque apresenta o motivo do estudo."
  },
  {
    "id": "56fe866a248c60c4",
    "materia": "Língua Portuguesa",
    "assunto": "Figura de linguagem",
    "pergunta": "Qual frase é exemplo de metáfora?",
    "alternativas": [
      "Aquele aluno é uma estrela.",
      "Ela correu como um raio.",
      "O livro está na mesa.",
      "A prova começa cedo."
    ],
    "correta": 0,
    "explicacao": "Metáfora associa sentidos sem conectivo comparativo explícito."
  },
  {
    "id": "028afea31d04e700",
    "materia": "Língua Portuguesa",
    "assunto": "Figura de linguagem",
    "pergunta": "Qual exemplo traz personificação?",
    "alternativas": [
      "O vento sussurrava entre as árvores.",
      "A água ferveu ao aquecer.",
      "A mesa tem quatro pernas.",
      "O trem chegou às seis."
    ],
    "correta": 0,
    "explicacao": "Personificação atribui qualidades humanas a elementos não humanos."
  },
  {
    "id": "e601e664beca1905",
    "materia": "Língua Portuguesa",
    "assunto": "Variação linguística",
    "pergunta": "A língua portuguesa varia de acordo com:",
    "alternativas": [
      "Contexto, região, grupo social e tempo",
      "Somente a idade do papel",
      "Apenas o número de letras",
      "Uma única forma imutável"
    ],
    "correta": 0,
    "explicacao": "As variedades linguísticas se relacionam a usos sociais e históricos."
  },
  {
    "id": "d2ad37c320207060",
    "materia": "Língua Portuguesa",
    "assunto": "Variação linguística",
    "pergunta": "Uma atitude respeitosa diante de variedades linguísticas é:",
    "alternativas": [
      "Evitar discriminação e adequar o registro ao contexto",
      "Ridicularizar sotaques",
      "Proibir palavras regionais",
      "Considerar uma variedade inferior"
    ],
    "correta": 0,
    "explicacao": "A diversidade é legítima; o registro varia conforme a situação comunicativa."
  },
  {
    "id": "df8044c174d4531f",
    "materia": "Língua Portuguesa",
    "assunto": "Resumo",
    "pergunta": "Um bom resumo deve:",
    "alternativas": [
      "Selecionar ideias essenciais sem distorcer o sentido",
      "Copiar o texto inteiro sempre",
      "Excluir o assunto principal",
      "Inserir fatos inventados"
    ],
    "correta": 0,
    "explicacao": "Resumir é condensar informações preservando o sentido original."
  },
  {
    "id": "44c7008a12dc2af7",
    "materia": "Língua Portuguesa",
    "assunto": "Paráfrase",
    "pergunta": "Parafrasear significa:",
    "alternativas": [
      "Reformular uma ideia com outras palavras sem mudar o sentido",
      "Copiar sem compreender",
      "Trocar apenas a pontuação",
      "Inventar a ideia contrária"
    ],
    "correta": 0,
    "explicacao": "A paráfrase reformula o conteúdo preservando o significado."
  },
  {
    "id": "d3bb1d38544893c2",
    "materia": "Língua Portuguesa",
    "assunto": "Leitura crítica",
    "pergunta": "Ao ler informação online, é importante:",
    "alternativas": [
      "Verificar fonte, data e evidências",
      "Compartilhar antes de ler",
      "Confiar apenas na manchete",
      "Ignorar autoria e contexto"
    ],
    "correta": 0,
    "explicacao": "Checar fontes ajuda a avaliar credibilidade e contexto."
  },
  {
    "id": "3896debee7f00724",
    "materia": "Língua Portuguesa",
    "assunto": "Produção textual",
    "pergunta": "Na revisão de um texto argumentativo, vale conferir:",
    "alternativas": [
      "Tese, argumentos, coesão e conclusão",
      "Somente a cor da fonte",
      "Somente o número de páginas",
      "Apenas o tamanho do título"
    ],
    "correta": 0,
    "explicacao": "Uma boa revisão avalia a organização e a clareza do texto."
  },
  {
    "id": "ffce9af68df14d2e",
    "materia": "Língua Portuguesa",
    "assunto": "Gêneros digitais",
    "pergunta": "Qual atitude ajuda a evitar desinformação em uma postagem?",
    "alternativas": [
      "Comparar a informação com fontes confiáveis",
      "Repassar sem verificar",
      "Confiar em manchetes alarmantes",
      "Ignorar a data da postagem"
    ],
    "correta": 0,
    "explicacao": "Comparar evidências e fontes reduz a circulação de informação enganosa."
  },
  {
    "id": "601b0aca150d758f",
    "materia": "Língua Portuguesa",
    "assunto": "Intertextualidade",
    "pergunta": "Quando um texto dialoga ou faz referência a outro, há:",
    "alternativas": [
      "Intertextualidade",
      "Concordância verbal obrigatória",
      "Cálculo de média",
      "Medida de volume"
    ],
    "correta": 0,
    "explicacao": "A intertextualidade ocorre na relação de sentidos entre textos."
  },
  {
    "id": "864fea2f265c5b67",
    "materia": "Língua Portuguesa",
    "assunto": "Linguagem verbal e não verbal",
    "pergunta": "Em uma charge, os desenhos e as palavras podem:",
    "alternativas": [
      "Construir sentidos em conjunto",
      "Ter sempre o mesmo sentido isolado",
      "Impedir qualquer interpretação",
      "Substituir totalmente o contexto"
    ],
    "correta": 0,
    "explicacao": "Linguagem visual e verbal podem se complementar ou produzir ironia."
  },
  {
    "id": "42ba46c50236414a",
    "materia": "Língua Portuguesa",
    "assunto": "Discurso direto e indireto",
    "pergunta": "Em \"Ana disse que chegaria cedo\", temos:",
    "alternativas": [
      "Discurso indireto",
      "Discurso direto com travessão",
      "Onomatopeia",
      "Apenas enumeração"
    ],
    "correta": 0,
    "explicacao": "No discurso indireto, a fala é relatada dentro da voz do narrador."
  },
  {
    "id": "fc50a06607154adc",
    "materia": "Inglês",
    "assunto": "Simple past",
    "pergunta": "Choose the correct past tense of \"go\".",
    "alternativas": [
      "Went",
      "Goed",
      "Going",
      "Goes"
    ],
    "correta": 0,
    "explicacao": "Go is irregular: its simple past form is went."
  },
  {
    "id": "10dbe2a271aed27f",
    "materia": "Inglês",
    "assunto": "Simple past",
    "pergunta": "Complete: \"Yesterday, she ___ a book.\"",
    "alternativas": [
      "read",
      "reads",
      "reading",
      "will read"
    ],
    "correta": 0,
    "explicacao": "Read has the same spelling in present and past, though the pronunciation changes."
  },
  {
    "id": "09050e793f0cda23",
    "materia": "Inglês",
    "assunto": "Simple past",
    "pergunta": "Which sentence describes a finished event in the past?",
    "alternativas": [
      "They visited the museum last Sunday.",
      "They visit the museum every Sunday.",
      "They will visit tomorrow.",
      "They are visiting now."
    ],
    "correta": 0,
    "explicacao": "Last Sunday indicates a completed past event."
  },
  {
    "id": "226a948c5e75ffe8",
    "materia": "Inglês",
    "assunto": "Past continuous",
    "pergunta": "Complete: \"I ___ watching TV when you called.\"",
    "alternativas": [
      "was",
      "were",
      "am",
      "be"
    ],
    "correta": 0,
    "explicacao": "The subject I combines with was in the past continuous."
  },
  {
    "id": "e5d8cec3310b3936",
    "materia": "Inglês",
    "assunto": "Past continuous",
    "pergunta": "Complete: \"They ___ studying at 8 p.m. yesterday.\"",
    "alternativas": [
      "were",
      "was",
      "are",
      "is"
    ],
    "correta": 0,
    "explicacao": "They were studying expresses an action in progress in the past."
  },
  {
    "id": "60ec98ffe9530327",
    "materia": "Inglês",
    "assunto": "Past continuous",
    "pergunta": "Which form combines with \"was\" to describe an ongoing past action?",
    "alternativas": [
      "Verb ending in -ing",
      "Base verb only",
      "Infinitive with to always",
      "Past participle only"
    ],
    "correta": 0,
    "explicacao": "Past continuous follows was/were + verb-ing."
  },
  {
    "id": "e6ecd64fcbcc97bf",
    "materia": "Inglês",
    "assunto": "Future with going to",
    "pergunta": "Complete: \"We are going to ___ tomorrow.\"",
    "alternativas": [
      "travel",
      "traveled",
      "travels",
      "traveling always"
    ],
    "correta": 0,
    "explicacao": "Be going to + base verb expresses a plan or prediction."
  },
  {
    "id": "e93a628db98628a9",
    "materia": "Inglês",
    "assunto": "Future with will",
    "pergunta": "Complete: \"I think it ___ rain tomorrow.\"",
    "alternativas": [
      "will",
      "was",
      "were",
      "had"
    ],
    "correta": 0,
    "explicacao": "Will + base verb is used for future predictions."
  },
  {
    "id": "a93fbb1ff582abd7",
    "materia": "Inglês",
    "assunto": "Comparatives",
    "pergunta": "What is the comparative of \"big\"?",
    "alternativas": [
      "Bigger",
      "Biggest",
      "More bigest",
      "Biger"
    ],
    "correta": 0,
    "explicacao": "For short adjectives ending in consonant-vowel-consonant, the final consonant often doubles."
  },
  {
    "id": "f8f89ce9b5992b30",
    "materia": "Inglês",
    "assunto": "Comparatives",
    "pergunta": "Complete: \"A bus is usually ___ than a bicycle.\"",
    "alternativas": [
      "heavier",
      "heaviest",
      "heavy",
      "more heavyest"
    ],
    "correta": 0,
    "explicacao": "Heavier is the comparative of heavy."
  },
  {
    "id": "f298edd46fd14853",
    "materia": "Inglês",
    "assunto": "Superlatives",
    "pergunta": "What is the superlative of \"good\"?",
    "alternativas": [
      "Best",
      "Goodest",
      "More good",
      "Better than"
    ],
    "correta": 0,
    "explicacao": "Good has irregular comparative better and superlative best."
  },
  {
    "id": "86a16140ebd8268b",
    "materia": "Inglês",
    "assunto": "Superlatives",
    "pergunta": "Complete: \"This is the ___ day of the week for me.\"",
    "alternativas": [
      "best",
      "better",
      "gooder",
      "more well"
    ],
    "correta": 0,
    "explicacao": "The superlative best marks the highest degree."
  },
  {
    "id": "819558852969d256",
    "materia": "Inglês",
    "assunto": "Modal verbs",
    "pergunta": "Which modal expresses ability?",
    "alternativas": [
      "Can",
      "Mustn't always",
      "Shouldn't always",
      "Mightn't only"
    ],
    "correta": 0,
    "explicacao": "Can is often used to express ability."
  },
  {
    "id": "6d34bbbe37993a6e",
    "materia": "Inglês",
    "assunto": "Modal verbs",
    "pergunta": "Complete: \"You ___ wear a seat belt in a car.\"",
    "alternativas": [
      "must",
      "might not necessarily",
      "was",
      "had been"
    ],
    "correta": 0,
    "explicacao": "Must expresses obligation in this statement."
  },
  {
    "id": "f88da1fea99235c6",
    "materia": "Inglês",
    "assunto": "Advice",
    "pergunta": "Which sentence gives advice?",
    "alternativas": [
      "You should study regularly.",
      "You studied yesterday.",
      "They are studying now.",
      "I will go tomorrow."
    ],
    "correta": 0,
    "explicacao": "Should is commonly used to give advice."
  },
  {
    "id": "90dd35e98d73e073",
    "materia": "Inglês",
    "assunto": "Conditionals",
    "pergunta": "Complete: \"If it rains, we ___ stay indoors.\"",
    "alternativas": [
      "will",
      "was",
      "were",
      "having"
    ],
    "correta": 0,
    "explicacao": "First conditional often uses if + simple present and will + base verb."
  },
  {
    "id": "a3e6dc0709681987",
    "materia": "Inglês",
    "assunto": "Connectors",
    "pergunta": "Which connector signals contrast?",
    "alternativas": [
      "However",
      "Because",
      "Therefore",
      "Moreover"
    ],
    "correta": 0,
    "explicacao": "However contrasts ideas."
  },
  {
    "id": "69d9593ac1cb0294",
    "materia": "Inglês",
    "assunto": "Connectors",
    "pergunta": "Which connector expresses a result?",
    "alternativas": [
      "Therefore",
      "Although",
      "Despite",
      "While"
    ],
    "correta": 0,
    "explicacao": "Therefore usually introduces a consequence or result."
  },
  {
    "id": "eaec51564cf79c23",
    "materia": "Inglês",
    "assunto": "Vocabulary",
    "pergunta": "What does \"environment\" mean in Portuguese?",
    "alternativas": [
      "Meio ambiente",
      "Entretenimento",
      "Encontro",
      "Experiência"
    ],
    "correta": 0,
    "explicacao": "Environment refers to the natural or surrounding environment."
  },
  {
    "id": "e108caf89439c45d",
    "materia": "Inglês",
    "assunto": "Vocabulary",
    "pergunta": "What is the opposite of \"dangerous\"?",
    "alternativas": [
      "Safe",
      "Risky",
      "Hazardous",
      "Unsafe"
    ],
    "correta": 0,
    "explicacao": "Safe means not dangerous."
  },
  {
    "id": "cbf2a8647d0744a6",
    "materia": "Inglês",
    "assunto": "Vocabulary",
    "pergunta": "What does \"borrow\" mean?",
    "alternativas": [
      "Pegar emprestado",
      "Emprestar a alguém",
      "Comprar",
      "Vender"
    ],
    "correta": 0,
    "explicacao": "Borrow is receiving something temporarily; lend is giving it temporarily."
  },
  {
    "id": "a9300a6384f7e0c9",
    "materia": "Inglês",
    "assunto": "Reading comprehension",
    "pergunta": "In \"Maya studies every morning\", when does Maya study?",
    "alternativas": [
      "Every morning",
      "Only on weekends",
      "Every night",
      "Never"
    ],
    "correta": 0,
    "explicacao": "Every morning means todas as manhãs."
  },
  {
    "id": "6cbe2029097e922f",
    "materia": "Inglês",
    "assunto": "Reading comprehension",
    "pergunta": "In \"The museum is closed on Mondays\", when is it not open?",
    "alternativas": [
      "On Mondays",
      "On Fridays",
      "On Saturdays",
      "Every evening"
    ],
    "correta": 0,
    "explicacao": "Closed on Mondays indicates the museum does not open that day."
  },
  {
    "id": "727165c7de0276c9",
    "materia": "Inglês",
    "assunto": "Pronouns",
    "pergunta": "Choose the correct possessive adjective: \"This is ___ backpack.\" (she)",
    "alternativas": [
      "her",
      "his",
      "their",
      "our"
    ],
    "correta": 0,
    "explicacao": "Her is the possessive adjective referring to she."
  },
  {
    "id": "f70c3974d12a0da3",
    "materia": "Inglês",
    "assunto": "Pronouns",
    "pergunta": "Complete: \"My friends and I prepared ___ presentation.\"",
    "alternativas": [
      "our",
      "his",
      "her",
      "its"
    ],
    "correta": 0,
    "explicacao": "Our refers to the speaker and at least one other person."
  },
  {
    "id": "2823cbd843d238a4",
    "materia": "Inglês",
    "assunto": "Cultural diversity",
    "pergunta": "Which is a respectful way to learn about English-speaking cultures?",
    "alternativas": [
      "Explore different voices and contexts without stereotypes",
      "Assume all speak exactly the same",
      "Ignore cultural differences",
      "Judge accents as inferior"
    ],
    "correta": 0,
    "explicacao": "English is used across countries and communities with varied cultures."
  },
  {
    "id": "19a8e029d9744d30",
    "materia": "Inglês",
    "assunto": "Digital literacy",
    "pergunta": "Before sharing an English-language article online, it is useful to:",
    "alternativas": [
      "Check the source and date",
      "Share immediately without reading",
      "Trust only the headline",
      "Ignore the author"
    ],
    "correta": 0,
    "explicacao": "Critical reading of digital media applies across languages."
  },
  {
    "id": "c8270a3fabe331f5",
    "materia": "Inglês",
    "assunto": "Questions",
    "pergunta": "Which question correctly asks about a past activity?",
    "alternativas": [
      "What did you do yesterday?",
      "What you did yesterday?",
      "What did you yesterday doed?",
      "What does you did?"
    ],
    "correta": 0,
    "explicacao": "Questions in simple past often use did + subject + base verb."
  },
  {
    "id": "56b7f4409d49a8f4",
    "materia": "Inglês",
    "assunto": "Frequency adverbs",
    "pergunta": "Which adverb means \"sempre\"?",
    "alternativas": [
      "Always",
      "Never",
      "Sometimes",
      "Rarely"
    ],
    "correta": 0,
    "explicacao": "Always indicates that something happens on every relevant occasion."
  },
  {
    "id": "587a3845954e7855",
    "materia": "Matemática",
    "assunto": "Potenciação",
    "pergunta": "Qual é o valor de 2 elevado à quinta potência?",
    "alternativas": [
      "32",
      "10",
      "16",
      "64"
    ],
    "correta": 0,
    "explicacao": "2⁵ é o produto de cinco fatores 2, resultando em 32."
  },
  {
    "id": "3637784d4fdae555",
    "materia": "Matemática",
    "assunto": "Potenciação",
    "pergunta": "Quanto vale 3 elevado à quarta potência?",
    "alternativas": [
      "81",
      "12",
      "27",
      "64"
    ],
    "correta": 0,
    "explicacao": "3 × 3 × 3 × 3 = 81."
  },
  {
    "id": "1ab43626a75864e4",
    "materia": "Matemática",
    "assunto": "Potenciação",
    "pergunta": "Na multiplicação 5³ × 5², o expoente da potência equivalente é:",
    "alternativas": [
      "5",
      "6",
      "1",
      "9"
    ],
    "correta": 0,
    "explicacao": "Com bases iguais, somamos os expoentes: 3 + 2 = 5."
  },
  {
    "id": "5890bc3c41108dcc",
    "materia": "Matemática",
    "assunto": "Radiciação",
    "pergunta": "A raiz quadrada principal de 144 é:",
    "alternativas": [
      "12",
      "72",
      "14",
      "24"
    ],
    "correta": 0,
    "explicacao": "12 × 12 = 144."
  },
  {
    "id": "1d46616f0fe4742e",
    "materia": "Matemática",
    "assunto": "Radiciação",
    "pergunta": "Qual número positivo ao quadrado resulta em 196?",
    "alternativas": [
      "14",
      "16",
      "13",
      "12"
    ],
    "correta": 0,
    "explicacao": "14² = 196."
  },
  {
    "id": "9b1ef6d0a53b0214",
    "materia": "Matemática",
    "assunto": "Notação científica",
    "pergunta": "Como escrever 4 500 000 em notação científica?",
    "alternativas": [
      "4,5 × 10⁶",
      "45 × 10⁵",
      "4,5 × 10⁵",
      "450 × 10⁴"
    ],
    "correta": 0,
    "explicacao": "O coeficiente deve ser maior ou igual a 1 e menor que 10: 4,5 × 10⁶."
  },
  {
    "id": "7f8dbb7366db7d23",
    "materia": "Matemática",
    "assunto": "Notação científica",
    "pergunta": "A notação científica 7,2 × 10³ representa:",
    "alternativas": [
      "7 200",
      "720",
      "72 000",
      "0,0072"
    ],
    "correta": 0,
    "explicacao": "Multiplicar por 10³ desloca a vírgula três casas para a direita."
  },
  {
    "id": "1d836c383ebed7b9",
    "materia": "Matemática",
    "assunto": "Números racionais",
    "pergunta": "Quanto é -3/4 + 1/2?",
    "alternativas": [
      "-1/4",
      "-2/6",
      "1/4",
      "-5/4"
    ],
    "correta": 0,
    "explicacao": "Transforme 1/2 em 2/4, então -3/4 + 2/4 = -1/4."
  },
  {
    "id": "3794e6b4ed923a56",
    "materia": "Matemática",
    "assunto": "Números racionais",
    "pergunta": "Qual é o resultado de -2,5 × 4?",
    "alternativas": [
      "-10",
      "-6,5",
      "10",
      "-1,5"
    ],
    "correta": 0,
    "explicacao": "Número negativo multiplicado por positivo é negativo: 2,5 × 4 = 10."
  },
  {
    "id": "6375ed457cf67381",
    "materia": "Matemática",
    "assunto": "Expressões algébricas",
    "pergunta": "Simplifique 3x + 2x - 4x.",
    "alternativas": [
      "x",
      "9x",
      "x²",
      "5x²"
    ],
    "correta": 0,
    "explicacao": "Somamos os coeficientes dos termos semelhantes: 3 + 2 − 4 = 1."
  },
  {
    "id": "cd3a93bb7efc51fa",
    "materia": "Matemática",
    "assunto": "Expressões algébricas",
    "pergunta": "Qual é o valor de 2a + 3 quando a = 4?",
    "alternativas": [
      "11",
      "9",
      "14",
      "13"
    ],
    "correta": 0,
    "explicacao": "Substitua a por 4: 2 × 4 + 3 = 11."
  },
  {
    "id": "2989d3868318f246",
    "materia": "Matemática",
    "assunto": "Expressões algébricas",
    "pergunta": "Qual é a expansão de 2(x + 5)?",
    "alternativas": [
      "2x + 10",
      "2x + 5",
      "x + 10",
      "10x"
    ],
    "correta": 0,
    "explicacao": "Use a propriedade distributiva: 2 vezes x e 2 vezes 5."
  },
  {
    "id": "2e3a935a629f15f0",
    "materia": "Matemática",
    "assunto": "Equação de primeiro grau",
    "pergunta": "Resolva 3x + 5 = 20.",
    "alternativas": [
      "x = 5",
      "x = 7",
      "x = 15",
      "x = 25"
    ],
    "correta": 0,
    "explicacao": "Subtraia 5 e divida por 3: x = 5."
  },
  {
    "id": "982699973373b126",
    "materia": "Matemática",
    "assunto": "Equação de primeiro grau",
    "pergunta": "Qual valor satisfaz 4y − 8 = 12?",
    "alternativas": [
      "5",
      "4",
      "3",
      "6"
    ],
    "correta": 0,
    "explicacao": "Somando 8 dos dois lados obtemos 4y = 20, logo y = 5."
  },
  {
    "id": "f59abb9ead727db2",
    "materia": "Matemática",
    "assunto": "Sistema de equações",
    "pergunta": "Se x + y = 10 e x − y = 2, quanto vale x?",
    "alternativas": [
      "6",
      "4",
      "5",
      "8"
    ],
    "correta": 0,
    "explicacao": "Some as equações: 2x = 12, então x = 6."
  },
  {
    "id": "447477a99a8f613b",
    "materia": "Matemática",
    "assunto": "Sistema de equações",
    "pergunta": "Num sistema, x + y = 9 e x = 2. Qual é y?",
    "alternativas": [
      "7",
      "11",
      "6",
      "18"
    ],
    "correta": 0,
    "explicacao": "Substitua x por 2: 2 + y = 9, logo y = 7."
  },
  {
    "id": "1c1ac570d85ae2e3",
    "materia": "Matemática",
    "assunto": "Proporcionalidade",
    "pergunta": "Se 3 cadernos custam R$ 18, quanto custam 5 iguais?",
    "alternativas": [
      "R$ 30",
      "R$ 24",
      "R$ 36",
      "R$ 28"
    ],
    "correta": 0,
    "explicacao": "Cada caderno custa R$ 6; cinco custam R$ 30."
  },
  {
    "id": "1faf07bd9094ec63",
    "materia": "Matemática",
    "assunto": "Proporcionalidade",
    "pergunta": "Para a mesma distância, se a velocidade dobra, o tempo necessário fica:",
    "alternativas": [
      "Pela metade",
      "O dobro",
      "Igual",
      "Quatro vezes maior"
    ],
    "correta": 0,
    "explicacao": "Para distância fixa, velocidade e tempo são inversamente proporcionais."
  },
  {
    "id": "42c8b0dad3d33d0f",
    "materia": "Matemática",
    "assunto": "Porcentagem",
    "pergunta": "Um produto de R$ 200 teve desconto de 15%. Qual é o preço final?",
    "alternativas": [
      "R$ 170",
      "R$ 185",
      "R$ 30",
      "R$ 215"
    ],
    "correta": 0,
    "explicacao": "15% de 200 é 30; 200 − 30 = 170."
  },
  {
    "id": "8c769df52dc8c267",
    "materia": "Matemática",
    "assunto": "Porcentagem",
    "pergunta": "Quanto representa 12% de 150?",
    "alternativas": [
      "18",
      "12",
      "15",
      "20"
    ],
    "correta": 0,
    "explicacao": "0,12 × 150 = 18."
  },
  {
    "id": "58e6352f51a620f5",
    "materia": "Matemática",
    "assunto": "Porcentagem",
    "pergunta": "Um valor de R$ 80 aumentou 25%. Qual é o novo valor?",
    "alternativas": [
      "R$ 100",
      "R$ 105",
      "R$ 85",
      "R$ 60"
    ],
    "correta": 0,
    "explicacao": "25% de 80 é 20; 80 + 20 = 100."
  },
  {
    "id": "0d6cec6a71291006",
    "materia": "Matemática",
    "assunto": "Estatística",
    "pergunta": "Qual é a média aritmética de 6, 8 e 10?",
    "alternativas": [
      "8",
      "7",
      "9",
      "24"
    ],
    "correta": 0,
    "explicacao": "A soma 6 + 8 + 10 = 24; divida pelos três valores."
  },
  {
    "id": "3eef32b4b796ea1e",
    "materia": "Matemática",
    "assunto": "Estatística",
    "pergunta": "Qual é a mediana de 2, 5, 9, 10 e 11?",
    "alternativas": [
      "9",
      "5",
      "10",
      "7"
    ],
    "correta": 0,
    "explicacao": "Na sequência ordenada com cinco números, a mediana é o terceiro."
  },
  {
    "id": "2923c68267954b8b",
    "materia": "Matemática",
    "assunto": "Estatística",
    "pergunta": "Na sequência 2, 3, 3, 5, 8, qual é a moda?",
    "alternativas": [
      "3",
      "2",
      "5",
      "8"
    ],
    "correta": 0,
    "explicacao": "Moda é o valor que aparece mais vezes."
  },
  {
    "id": "f79ed39525ac4fe0",
    "materia": "Matemática",
    "assunto": "Estatística",
    "pergunta": "Uma pesquisa com parte dos estudantes para representar uma escola utiliza:",
    "alternativas": [
      "Uma amostra",
      "Uma equação",
      "Uma potência",
      "Uma área"
    ],
    "correta": 0,
    "explicacao": "A amostra é o subconjunto observado da população investigada."
  },
  {
    "id": "04ad697e19838bbe",
    "materia": "Matemática",
    "assunto": "Probabilidade",
    "pergunta": "Uma moeda equilibrada é lançada. Qual é a chance de sair cara?",
    "alternativas": [
      "1/2",
      "1/3",
      "1/4",
      "2/3"
    ],
    "correta": 0,
    "explicacao": "Há dois resultados igualmente prováveis e apenas um favorável."
  },
  {
    "id": "aa773b15d288615a",
    "materia": "Matemática",
    "assunto": "Probabilidade",
    "pergunta": "Ao lançar um dado comum, a probabilidade de obter número par é:",
    "alternativas": [
      "1/2",
      "1/6",
      "1/3",
      "2/3"
    ],
    "correta": 0,
    "explicacao": "Existem três números pares entre seis faces: 2, 4 e 6."
  },
  {
    "id": "5f1fe83cc2f1fda6",
    "materia": "Matemática",
    "assunto": "Geometria",
    "pergunta": "Qual é a soma dos ângulos internos de um quadrilátero?",
    "alternativas": [
      "360°",
      "180°",
      "540°",
      "90°"
    ],
    "correta": 0,
    "explicacao": "Todo quadrilátero pode ser dividido em dois triângulos: 2 × 180°."
  },
  {
    "id": "e3a816f19c44a5c4",
    "materia": "Matemática",
    "assunto": "Geometria",
    "pergunta": "Um triângulo tem ângulos 40° e 65°. Quanto mede o terceiro?",
    "alternativas": [
      "75°",
      "85°",
      "95°",
      "65°"
    ],
    "correta": 0,
    "explicacao": "Os três ângulos somam 180°: 180 − 40 − 65 = 75."
  },
  {
    "id": "3be38aadade1795c",
    "materia": "Matemática",
    "assunto": "Geometria",
    "pergunta": "Dois ângulos são suplementares. Um mede 125°. Quanto mede o outro?",
    "alternativas": [
      "55°",
      "65°",
      "45°",
      "125°"
    ],
    "correta": 0,
    "explicacao": "Ângulos suplementares somam 180°."
  },
  {
    "id": "3b20feb76bf3412e",
    "materia": "Matemática",
    "assunto": "Área e perímetro",
    "pergunta": "Um retângulo mede 7 cm por 4 cm. Qual é sua área?",
    "alternativas": [
      "28 cm²",
      "22 cm²",
      "14 cm²",
      "11 cm²"
    ],
    "correta": 0,
    "explicacao": "A área do retângulo é base × altura, ou 7 × 4."
  },
  {
    "id": "fa8551d7e5c200ae",
    "materia": "Matemática",
    "assunto": "Área e perímetro",
    "pergunta": "Um quadrado tem lado de 6 cm. Seu perímetro é:",
    "alternativas": [
      "24 cm",
      "36 cm²",
      "12 cm",
      "18 cm"
    ],
    "correta": 0,
    "explicacao": "O perímetro é a soma dos quatro lados: 4 × 6."
  },
  {
    "id": "5d611028622dc18b",
    "materia": "Matemática",
    "assunto": "Volume",
    "pergunta": "Um paralelepípedo mede 2 cm, 3 cm e 5 cm. Qual é o volume?",
    "alternativas": [
      "30 cm³",
      "10 cm³",
      "25 cm³",
      "60 cm³"
    ],
    "correta": 0,
    "explicacao": "Multiplique comprimento, largura e altura: 2 × 3 × 5."
  },
  {
    "id": "91d9004381414bb3",
    "materia": "Matemática",
    "assunto": "Transformações geométricas",
    "pergunta": "A reflexão de uma figura em um eixo produz:",
    "alternativas": [
      "Uma imagem espelhada",
      "Uma redução obrigatória",
      "Uma rotação de 90°",
      "Uma ampliação obrigatória"
    ],
    "correta": 0,
    "explicacao": "A reflexão conserva distâncias e produz simetria em relação a um eixo."
  },
  {
    "id": "ea59840e172e7afc",
    "materia": "Matemática",
    "assunto": "Plano cartesiano",
    "pergunta": "Qual ponto está no segundo quadrante?",
    "alternativas": [
      "(-3, 4)",
      "(3, 4)",
      "(3, -4)",
      "(-3, -4)"
    ],
    "correta": 0,
    "explicacao": "No segundo quadrante, x é negativo e y é positivo."
  },
  {
    "id": "76f5ba9edcac007c",
    "materia": "História",
    "assunto": "Iluminismo",
    "pergunta": "Qual ideia está associada ao Iluminismo?",
    "alternativas": [
      "Valorizar a razão e questionar o absolutismo",
      "Defender apenas a autoridade de reis",
      "Proibir a investigação científica",
      "Rejeitar qualquer debate"
    ],
    "correta": 0,
    "explicacao": "O Iluminismo valorizou razão, ciência e críticas a privilégios e poderes absolutos."
  },
  {
    "id": "33f96b05a696efde",
    "materia": "História",
    "assunto": "Iluminismo",
    "pergunta": "Quem formulou a ideia de separação dos poderes em sua obra política?",
    "alternativas": [
      "Montesquieu",
      "Napoleão Bonaparte",
      "Cristóvão Colombo",
      "D. Pedro II"
    ],
    "correta": 0,
    "explicacao": "Montesquieu defendeu uma divisão de funções entre poderes para limitar abusos."
  },
  {
    "id": "fad4482ce7977ae3",
    "materia": "História",
    "assunto": "Iluminismo",
    "pergunta": "O pensamento de Rousseau esteve associado à reflexão sobre:",
    "alternativas": [
      "Contrato social e soberania popular",
      "Expansão da mineração romana",
      "Navegação viking",
      "Descoberta da penicilina"
    ],
    "correta": 0,
    "explicacao": "Rousseau discutiu legitimidade política e a vontade geral."
  },
  {
    "id": "f649317544a46be9",
    "materia": "História",
    "assunto": "Revolução Industrial",
    "pergunta": "Onde teve início a Primeira Revolução Industrial?",
    "alternativas": [
      "Na Inglaterra",
      "No Brasil",
      "Na China do século XX",
      "Na Rússia medieval"
    ],
    "correta": 0,
    "explicacao": "A Inglaterra reuniu condições econômicas e técnicas para a industrialização inicial."
  },
  {
    "id": "2ce198584cd6f925",
    "materia": "História",
    "assunto": "Revolução Industrial",
    "pergunta": "Uma consequência da industrialização foi:",
    "alternativas": [
      "Expansão das fábricas e do trabalho assalariado",
      "Desaparecimento de todas as cidades",
      "Fim da produção em máquinas",
      "Redução total do comércio"
    ],
    "correta": 0,
    "explicacao": "A industrialização reorganizou a produção e ampliou cidades industriais."
  },
  {
    "id": "ca1b4b18a74eef78",
    "materia": "História",
    "assunto": "Revolução Industrial",
    "pergunta": "Qual fonte de energia foi central na Primeira Revolução Industrial?",
    "alternativas": [
      "Carvão mineral",
      "Energia nuclear",
      "Energia solar fotovoltaica",
      "Petróleo em aviões a jato"
    ],
    "correta": 0,
    "explicacao": "O carvão alimentou máquinas a vapor e atividades industriais."
  },
  {
    "id": "b08c041cb69b0be1",
    "materia": "História",
    "assunto": "Revolução Americana",
    "pergunta": "A independência das Treze Colônias foi declarada em:",
    "alternativas": [
      "1776",
      "1500",
      "1822",
      "1889"
    ],
    "correta": 0,
    "explicacao": "A declaração de independência foi aprovada em 1776."
  },
  {
    "id": "63fea39644b59241",
    "materia": "História",
    "assunto": "Revolução Americana",
    "pergunta": "Um motivo de insatisfação das colônias britânicas foi:",
    "alternativas": [
      "Tributação sem representação no Parlamento",
      "Abolição de todos os impostos",
      "Conquista do Japão",
      "Criação de uma república francesa"
    ],
    "correta": 0,
    "explicacao": "As colônias criticavam impostos definidos sem representação política."
  },
  {
    "id": "4b182ad9f57c7c04",
    "materia": "História",
    "assunto": "Revolução Francesa",
    "pergunta": "Qual lema é associado à Revolução Francesa?",
    "alternativas": [
      "Liberdade, igualdade e fraternidade",
      "Ordem e silêncio",
      "Paz e isolamento",
      "Império e colonização"
    ],
    "correta": 0,
    "explicacao": "O lema sintetiza ideais políticos que ganharam destaque na revolução."
  },
  {
    "id": "05c282737b364f2f",
    "materia": "História",
    "assunto": "Revolução Francesa",
    "pergunta": "A queda da Bastilha aconteceu em:",
    "alternativas": [
      "1789",
      "1799",
      "1808",
      "1888"
    ],
    "correta": 0,
    "explicacao": "A tomada da Bastilha ocorreu em 14 de julho de 1789."
  },
  {
    "id": "4dc514f3e6a766d0",
    "materia": "História",
    "assunto": "Revolução Francesa",
    "pergunta": "O Antigo Regime francês era marcado por:",
    "alternativas": [
      "Privilégios estamentais e monarquia absoluta",
      "Igualdade política universal efetiva",
      "Ausência de tributos",
      "Eleições diretas para todos"
    ],
    "correta": 0,
    "explicacao": "A sociedade estamental concedia privilégios legais a determinados grupos."
  },
  {
    "id": "62fcc0fb3a5e306c",
    "materia": "História",
    "assunto": "Era Napoleônica",
    "pergunta": "O Código Napoleônico contribuiu para:",
    "alternativas": [
      "Organizar leis civis e defender igualdade jurídica masculina, mantendo limites sociais",
      "Eliminar toda propriedade privada",
      "Abolir qualquer governo",
      "Implantar o voto universal imediato"
    ],
    "correta": 0,
    "explicacao": "O código consolidou direitos civis, mas não garantiu igualdade plena para todos."
  },
  {
    "id": "bd4bdd171ae662a3",
    "materia": "História",
    "assunto": "América Latina",
    "pergunta": "Um líder ligado a movimentos de independência hispano-americanos foi:",
    "alternativas": [
      "Simón Bolívar",
      "Martim Afonso de Sousa",
      "Getúlio Vargas",
      "Tiradentes como presidente do Peru"
    ],
    "correta": 0,
    "explicacao": "Bolívar liderou movimentos em regiões do norte da América do Sul."
  },
  {
    "id": "81184c8f7c8bdd72",
    "materia": "História",
    "assunto": "América Latina",
    "pergunta": "As independências hispano-americanas ocorreram em grande parte no:",
    "alternativas": [
      "Início do século XIX",
      "Início do século XV",
      "Final do século XX",
      "Século VIII"
    ],
    "correta": 0,
    "explicacao": "Vários territórios romperam com a Espanha no começo dos anos 1800."
  },
  {
    "id": "f330058e23e5a5b8",
    "materia": "História",
    "assunto": "Independência do Brasil",
    "pergunta": "A independência política do Brasil foi proclamada em:",
    "alternativas": [
      "1822",
      "1789",
      "1888",
      "1930"
    ],
    "correta": 0,
    "explicacao": "O marco político tradicional da independência é 7 de setembro de 1822."
  },
  {
    "id": "77402e14a8165c58",
    "materia": "História",
    "assunto": "Independência do Brasil",
    "pergunta": "A chegada da corte portuguesa ao Brasil em 1808 teve como consequência:",
    "alternativas": [
      "Abertura dos portos às nações amigas",
      "Fim imediato da escravidão",
      "Proclamação da República",
      "Independência automática em 1808"
    ],
    "correta": 0,
    "explicacao": "A transferência da corte alterou administração, comércio e instituições."
  },
  {
    "id": "c94172807e1bb5b9",
    "materia": "História",
    "assunto": "Primeiro Reinado",
    "pergunta": "Quem foi o primeiro imperador do Brasil independente?",
    "alternativas": [
      "D. Pedro I",
      "D. Pedro II",
      "Deodoro da Fonseca",
      "Dom João VI após 1889"
    ],
    "correta": 0,
    "explicacao": "D. Pedro I governou como imperador de 1822 a 1831."
  },
  {
    "id": "a930d1928f612a6f",
    "materia": "História",
    "assunto": "Primeiro Reinado",
    "pergunta": "A primeira Constituição brasileira foi outorgada em:",
    "alternativas": [
      "1824",
      "1889",
      "1934",
      "1988"
    ],
    "correta": 0,
    "explicacao": "A Constituição de 1824 estabeleceu a monarquia constitucional e o Poder Moderador."
  },
  {
    "id": "d924a4988af24bc9",
    "materia": "História",
    "assunto": "Período Regencial",
    "pergunta": "O Período Regencial aconteceu entre:",
    "alternativas": [
      "1831 e 1840",
      "1822 e 1824",
      "1889 e 1894",
      "1964 e 1985"
    ],
    "correta": 0,
    "explicacao": "As regências governaram durante a menoridade de D. Pedro II."
  },
  {
    "id": "71343acbd79c3514",
    "materia": "História",
    "assunto": "Período Regencial",
    "pergunta": "A Cabanagem ocorreu principalmente em qual província do Império?",
    "alternativas": [
      "Grão-Pará",
      "Rio Grande do Sul",
      "São Paulo",
      "Goiás"
    ],
    "correta": 0,
    "explicacao": "A Cabanagem foi uma revolta social e política na província do Grão-Pará."
  },
  {
    "id": "abff0885bd6e4040",
    "materia": "História",
    "assunto": "Segundo Reinado",
    "pergunta": "Quem governou o Brasil durante o Segundo Reinado?",
    "alternativas": [
      "D. Pedro II",
      "D. Pedro I",
      "Tiradentes",
      "Juscelino Kubitschek"
    ],
    "correta": 0,
    "explicacao": "D. Pedro II assumiu o poder em 1840 e reinou até 1889."
  },
  {
    "id": "b6ff5cf84dc122d5",
    "materia": "História",
    "assunto": "Segundo Reinado",
    "pergunta": "Qual produto teve grande importância nas exportações brasileiras do século XIX?",
    "alternativas": [
      "Café",
      "Petróleo refinado",
      "Silício para chips",
      "Satélites"
    ],
    "correta": 0,
    "explicacao": "O café ganhou destaque na economia exportadora do Império."
  },
  {
    "id": "fe6c62cc4b5ac3af",
    "materia": "História",
    "assunto": "Abolicionismo",
    "pergunta": "Qual lei aboliu juridicamente a escravidão no Brasil?",
    "alternativas": [
      "Lei Áurea, de 1888",
      "Lei de Terras, de 1850",
      "Constituição de 1824",
      "Lei do Ventre Livre, de 1871"
    ],
    "correta": 0,
    "explicacao": "A Lei Áurea extinguiu legalmente a escravidão, após longa luta de pessoas escravizadas e abolicionistas."
  },
  {
    "id": "5df7dcef52b8737b",
    "materia": "História",
    "assunto": "Abolicionismo",
    "pergunta": "O movimento abolicionista brasileiro incluiu:",
    "alternativas": [
      "Atuação de pessoas negras, escravizadas, libertas e aliados",
      "Somente decisões do imperador",
      "Apenas ações de comerciantes europeus",
      "Exclusivamente militares estrangeiros"
    ],
    "correta": 0,
    "explicacao": "A abolição resultou de resistência, organização política e movimentos sociais diversos."
  },
  {
    "id": "2bbafe66c57837d9",
    "materia": "História",
    "assunto": "Trabalho e sociedade",
    "pergunta": "No século XIX brasileiro, a resistência de pessoas escravizadas ocorreu por meio de:",
    "alternativas": [
      "Fugas, quilombos e outras formas de organização",
      "Apenas ações autorizadas pelos senhores",
      "Ausência de qualquer luta",
      "Somente decisões estrangeiras"
    ],
    "correta": 0,
    "explicacao": "A resistência à escravização teve muitas formas individuais e coletivas."
  },
  {
    "id": "299c5231946681e9",
    "materia": "História",
    "assunto": "Imperialismo",
    "pergunta": "No século XIX, o imperialismo europeu intensificou:",
    "alternativas": [
      "A expansão política e econômica sobre regiões da África e da Ásia",
      "A independência de todos os territórios colonizados",
      "O fim de guerras coloniais",
      "O desaparecimento de mercados mundiais"
    ],
    "correta": 0,
    "explicacao": "Potências europeias ampliaram a dominação territorial e econômica."
  },
  {
    "id": "a294de0a9b49b63d",
    "materia": "História",
    "assunto": "África no século XIX",
    "pergunta": "A Conferência de Berlim de 1884-1885 relacionou-se à:",
    "alternativas": [
      "Disputa e partilha colonial da África",
      "Independência do Brasil",
      "Criação da ONU",
      "Formação da União Europeia"
    ],
    "correta": 0,
    "explicacao": "A conferência estabeleceu regras de ocupação colonial sem representação dos povos africanos."
  },
  {
    "id": "e2eb4ad6dabd8330",
    "materia": "História",
    "assunto": "Movimentos sociais",
    "pergunta": "Uma contribuição importante de diferentes movimentos políticos do século XIX foi:",
    "alternativas": [
      "Questionar desigualdades e defender mudanças sociais",
      "Impedir toda participação popular",
      "Proibir associações",
      "Eliminar discussões sobre direitos"
    ],
    "correta": 0,
    "explicacao": "Movimentos sociais expressaram demandas por participação, trabalho e direitos."
  },
  {
    "id": "27c96a2c9ab34fe0",
    "materia": "História",
    "assunto": "História e fontes",
    "pergunta": "Cartas, jornais e fotografias do século XIX são exemplos de:",
    "alternativas": [
      "Fontes históricas",
      "Provas de que tudo registrado é verdadeiro",
      "Máquinas do tempo",
      "Leis universais da física"
    ],
    "correta": 0,
    "explicacao": "Fontes ajudam a investigar o passado quando analisadas criticamente."
  },
  {
    "id": "17ab45c4d36f05d0",
    "materia": "História",
    "assunto": "História e memória",
    "pergunta": "Para analisar uma fonte histórica, é importante perguntar:",
    "alternativas": [
      "Quem produziu, quando, por quê e para quem?",
      "Somente quantas letras tem",
      "Apenas se está colorida",
      "Somente se usa papel"
    ],
    "correta": 0,
    "explicacao": "Contextualizar autoria e objetivo permite uma leitura crítica."
  },
  {
    "id": "36cf9d3ecbc4ce29",
    "materia": "Educação Física",
    "assunto": "Esportes de invasão",
    "pergunta": "Qual é um exemplo de esporte de invasão?",
    "alternativas": [
      "Handebol",
      "Natação",
      "Atletismo de pista",
      "Ginástica artística"
    ],
    "correta": 0,
    "explicacao": "No handebol, as equipes avançam ao campo adversário para marcar gols."
  },
  {
    "id": "6ef5832663ec6286",
    "materia": "Educação Física",
    "assunto": "Esportes de invasão",
    "pergunta": "Em esportes coletivos, o passe pode ajudar a:",
    "alternativas": [
      "Manter a posse e construir jogadas",
      "Impedir toda cooperação",
      "Encerrar todas as partidas",
      "Reduzir a necessidade de comunicação"
    ],
    "correta": 0,
    "explicacao": "Passes ajudam a movimentar a bola e a organizar estratégias coletivas."
  },
  {
    "id": "a52478203d64f18d",
    "materia": "Educação Física",
    "assunto": "Esportes de rede",
    "pergunta": "Qual é um exemplo de esporte de rede divisória?",
    "alternativas": [
      "Voleibol",
      "Futsal",
      "Basquete",
      "Rúgbi"
    ],
    "correta": 0,
    "explicacao": "No voleibol, equipes são separadas por uma rede."
  },
  {
    "id": "7a2526db93e28bc1",
    "materia": "Educação Física",
    "assunto": "Esportes de rede",
    "pergunta": "No voleibol, o rodízio ocorre quando a equipe:",
    "alternativas": [
      "Ganha o direito de sacar após estar recebendo",
      "Marca qualquer ponto sem mudança de saque",
      "Pede tempo técnico",
      "Inicia uma nova competição"
    ],
    "correta": 0,
    "explicacao": "Nas regras padrão, o rodízio ocorre quando a equipe passa a ter o saque."
  },
  {
    "id": "89419ae1169f195a",
    "materia": "Educação Física",
    "assunto": "Esportes de campo e taco",
    "pergunta": "Qual modalidade envolve rebatidas e corridas entre bases?",
    "alternativas": [
      "Beisebol",
      "Natação",
      "Judô",
      "Ginástica rítmica"
    ],
    "correta": 0,
    "explicacao": "O beisebol combina rebatidas e deslocamento entre bases."
  },
  {
    "id": "8439ca2898ad788f",
    "materia": "Educação Física",
    "assunto": "Esportes de combate",
    "pergunta": "Uma prática esportiva de combate pode envolver:",
    "alternativas": [
      "Regras, respeito e técnicas de oposição",
      "Obrigação de machucar alguém",
      "Ausência de regras",
      "Competição sem controle"
    ],
    "correta": 0,
    "explicacao": "Esportes de combate são regulados e devem priorizar segurança e respeito."
  },
  {
    "id": "ace5be0d09b2cbd3",
    "materia": "Educação Física",
    "assunto": "Lutas",
    "pergunta": "No estudo de lutas, é importante valorizar:",
    "alternativas": [
      "História, cultura, regras e segurança",
      "Somente força bruta",
      "A ausência de respeito",
      "Imitação de violência fora do esporte"
    ],
    "correta": 0,
    "explicacao": "As lutas são manifestações culturais e esportivas, com técnicas e normas."
  },
  {
    "id": "adcd62f4c62fa396",
    "materia": "Educação Física",
    "assunto": "Capoeira",
    "pergunta": "A capoeira combina historicamente:",
    "alternativas": [
      "Movimento, música, cultura e resistência afro-brasileira",
      "Somente corridas de pista",
      "Apenas movimentos de natação",
      "Exclusivamente dança europeia"
    ],
    "correta": 0,
    "explicacao": "A capoeira reúne jogo corporal, música e história afro-brasileira."
  },
  {
    "id": "838b10403f94496e",
    "materia": "Educação Física",
    "assunto": "Danças",
    "pergunta": "Danças urbanas podem ser estudadas como:",
    "alternativas": [
      "Manifestações culturais de diferentes grupos e contextos",
      "Uma única coreografia obrigatória",
      "Práticas sem história",
      "Somente movimentos de competição"
    ],
    "correta": 0,
    "explicacao": "Danças urbanas possuem trajetórias e linguagens diversas."
  },
  {
    "id": "d24fb0d165c3a13c",
    "materia": "Educação Física",
    "assunto": "Danças",
    "pergunta": "O que contribui para uma coreografia coletiva?",
    "alternativas": [
      "Combinação de movimentos, ritmo e comunicação entre participantes",
      "A ausência de escuta",
      "A imposição de um único movimento",
      "A eliminação do espaço"
    ],
    "correta": 0,
    "explicacao": "Coreografias coletivas valorizam diálogo, ritmo e criação em grupo."
  },
  {
    "id": "ae7245787e4f3a49",
    "materia": "Educação Física",
    "assunto": "Ginásticas",
    "pergunta": "Alongamento e mobilidade devem ser praticados com:",
    "alternativas": [
      "Respeito aos limites individuais e orientação adequada",
      "Dor obrigatória",
      "Comparações com colegas",
      "Exigência de resultados idênticos"
    ],
    "correta": 0,
    "explicacao": "Movimentar-se com cuidado e respeitar limites favorece uma prática segura."
  },
  {
    "id": "b1142d075f6eee1e",
    "materia": "Educação Física",
    "assunto": "Ginásticas",
    "pergunta": "Na ginástica para todos, o objetivo inclui:",
    "alternativas": [
      "Participação, cooperação e expressão corporal",
      "Exclusão de iniciantes",
      "Somente recordes profissionais",
      "Obrigação de competição"
    ],
    "correta": 0,
    "explicacao": "Ginástica para todos incentiva participação e expressão, com adaptações inclusivas."
  },
  {
    "id": "a80dfb03341ffbf2",
    "materia": "Educação Física",
    "assunto": "Saúde e movimento",
    "pergunta": "A atividade física regular pode contribuir para:",
    "alternativas": [
      "Bem-estar físico e mental",
      "Eliminar a necessidade de sono",
      "Curar qualquer doença sozinha",
      "Exigir desempenho igual ao de atletas"
    ],
    "correta": 0,
    "explicacao": "Movimento adequado à idade e às condições individuais favorece a saúde."
  },
  {
    "id": "50edf0421aa9518e",
    "materia": "Educação Física",
    "assunto": "Saúde e movimento",
    "pergunta": "Por que o descanso é importante em uma rotina de exercícios?",
    "alternativas": [
      "Ajuda na recuperação e no bem-estar",
      "É sempre desnecessário",
      "Diminui obrigatoriamente a aprendizagem",
      "Substitui a alimentação"
    ],
    "correta": 0,
    "explicacao": "A recuperação faz parte de práticas corporais equilibradas."
  },
  {
    "id": "960ca21d0720701c",
    "materia": "Educação Física",
    "assunto": "Segurança",
    "pergunta": "Em atividades esportivas escolares, uma medida importante é:",
    "alternativas": [
      "Seguir orientações, regras e condições seguras",
      "Ignorar o aquecimento sempre",
      "Brincar com riscos não avaliados",
      "Desconsiderar o espaço disponível"
    ],
    "correta": 0,
    "explicacao": "Segurança envolve ambiente adequado e orientação responsável."
  },
  {
    "id": "e262f3952910fd06",
    "materia": "Educação Física",
    "assunto": "Inclusão",
    "pergunta": "Uma partida inclusiva deve priorizar:",
    "alternativas": [
      "Regras adaptáveis e participação respeitosa",
      "Exclusão por níveis de habilidade",
      "Discriminação por aparência",
      "Impedimento de cooperação"
    ],
    "correta": 0,
    "explicacao": "A inclusão considera diferentes necessidades e possibilidades de participação."
  },
  {
    "id": "708bd5e20cac88ed",
    "materia": "Educação Física",
    "assunto": "Fair play",
    "pergunta": "Qual atitude demonstra jogo limpo?",
    "alternativas": [
      "Respeitar adversários, regras e decisões",
      "Humilhar quem errou",
      "Trapacear em silêncio",
      "Esconder riscos"
    ],
    "correta": 0,
    "explicacao": "Jogo limpo envolve ética e respeito nas práticas esportivas."
  },
  {
    "id": "097da6fdaddd0e53",
    "materia": "Educação Física",
    "assunto": "Esporte e sociedade",
    "pergunta": "O esporte pode ser analisado também como:",
    "alternativas": [
      "Fenômeno cultural, econômico e social",
      "Apenas questão de pontos",
      "Atividade isolada da sociedade",
      "Somente um conjunto de exercícios"
    ],
    "correta": 0,
    "explicacao": "O esporte tem relações com identidades, mídia, trabalho e cultura."
  },
  {
    "id": "f98ab1c2708752da",
    "materia": "Educação Física",
    "assunto": "Mídia e esporte",
    "pergunta": "A mídia esportiva pode influenciar:",
    "alternativas": [
      "Visibilidade de modalidades e percepções do público",
      "A gravidade da Terra",
      "As regras matemáticas",
      "A idade do planeta"
    ],
    "correta": 0,
    "explicacao": "A cobertura pode favorecer algumas modalidades e invisibilizar outras."
  },
  {
    "id": "1b722150630da5cd",
    "materia": "Educação Física",
    "assunto": "Brincadeiras e jogos",
    "pergunta": "Jogos cooperativos valorizam:",
    "alternativas": [
      "Objetivos compartilhados e colaboração",
      "Somente eliminação de colegas",
      "Resultados sempre individuais",
      "Ausência de diálogo"
    ],
    "correta": 0,
    "explicacao": "Em jogos cooperativos, o grupo atua para alcançar metas conjuntas."
  },
  {
    "id": "796c3dec8dd784f6",
    "materia": "Educação Física",
    "assunto": "Brincadeiras e jogos",
    "pergunta": "Uma regra de jogo pode ser adaptada para:",
    "alternativas": [
      "Garantir acessibilidade e participação",
      "Excluir alunos com dificuldades",
      "Impedir iniciativas de grupo",
      "Aumentar riscos"
    ],
    "correta": 0,
    "explicacao": "Adaptações ajudam a incluir estudantes e respeitar diferenças."
  },
  {
    "id": "3a0ecc4c9f85ed5c",
    "materia": "Educação Física",
    "assunto": "Esportes de marca",
    "pergunta": "No atletismo, uma prova de marca busca:",
    "alternativas": [
      "Alcançar determinada medida de tempo, distância ou altura",
      "Fazer pontos em uma cesta",
      "Dominar território",
      "Superar adversários por contato"
    ],
    "correta": 0,
    "explicacao": "Esportes de marca registram desempenhos mensuráveis como tempo e distância."
  },
  {
    "id": "39f68348c45815c2",
    "materia": "Educação Física",
    "assunto": "Esportes de precisão",
    "pergunta": "Qual é uma característica de esporte de precisão?",
    "alternativas": [
      "Atingir um alvo com controle da ação",
      "Somente correr mais rápido",
      "Marcar gol em invasão",
      "Realizar um saque sobre rede"
    ],
    "correta": 0,
    "explicacao": "Esportes de precisão valorizam acerto e controle."
  },
  {
    "id": "1a7173ea2de63423",
    "materia": "Educação Física",
    "assunto": "Esportes técnico-combinatórios",
    "pergunta": "Uma modalidade que combina diferentes movimentos avaliados pela execução é:",
    "alternativas": [
      "Ginástica artística",
      "Futsal",
      "Basquete",
      "Corrida de 100 metros"
    ],
    "correta": 0,
    "explicacao": "Esportes técnico-combinatórios avaliam séries técnicas segundo critérios."
  },
  {
    "id": "428e86d6a305e17e",
    "materia": "Educação Física",
    "assunto": "Cultura corporal",
    "pergunta": "Ao estudar práticas corporais de comunidades diferentes, devemos:",
    "alternativas": [
      "Reconhecer origens e respeitar os praticantes",
      "Apropriar-se sem conhecer contexto",
      "Ridicularizar tradições",
      "Presumir que todas são iguais"
    ],
    "correta": 0,
    "explicacao": "Práticas corporais têm histórias e significados culturais próprios."
  },
  {
    "id": "d684e77acf1cfd39",
    "materia": "Educação Física",
    "assunto": "Arbitragem",
    "pergunta": "Uma função da arbitragem em esportes é:",
    "alternativas": [
      "Aplicar regras com imparcialidade",
      "Favorecer a própria equipe",
      "Mudar resultados sem critérios",
      "Impedir toda participação"
    ],
    "correta": 0,
    "explicacao": "Árbitros ajudam a garantir o cumprimento das regras esportivas."
  },
  {
    "id": "0d9bc90b181190dd",
    "materia": "Geografia",
    "assunto": "Globalização",
    "pergunta": "O termo globalização descreve principalmente:",
    "alternativas": [
      "Integração crescente de fluxos econômicos, culturais e informacionais",
      "Isolamento completo dos países",
      "Fim de toda comunicação",
      "Desaparecimento das cidades"
    ],
    "correta": 0,
    "explicacao": "Redes de transporte, comércio e informação conectam diferentes partes do mundo."
  },
  {
    "id": "f4c68e5974a9a388",
    "materia": "Geografia",
    "assunto": "Globalização",
    "pergunta": "Uma característica das cadeias produtivas globais é:",
    "alternativas": [
      "Etapas de produção distribuídas entre diferentes países",
      "Produção sempre em um único bairro",
      "Comércio proibido",
      "Ausência de transporte"
    ],
    "correta": 0,
    "explicacao": "Empresas podem organizar projeto, fabricação e distribuição em locais distintos."
  },
  {
    "id": "bc780e6c48ee6a48",
    "materia": "Geografia",
    "assunto": "Globalização",
    "pergunta": "Qual tecnologia acelerou a circulação global de informações?",
    "alternativas": [
      "Internet",
      "Máquina de escrever manual apenas",
      "Arado de madeira",
      "Relógio de sol"
    ],
    "correta": 0,
    "explicacao": "Redes digitais facilitam trocas rápidas de informações."
  },
  {
    "id": "782e8d5afaada5a9",
    "materia": "Geografia",
    "assunto": "Migrações",
    "pergunta": "Qual fator pode motivar migrações?",
    "alternativas": [
      "Busca por trabalho, segurança e melhores condições de vida",
      "Apenas a mudança de estação",
      "Somente diferenças de idioma",
      "Exclusivamente o horário"
    ],
    "correta": 0,
    "explicacao": "Migrações têm causas econômicas, políticas, ambientais e familiares."
  },
  {
    "id": "ca0925b803217732",
    "materia": "Geografia",
    "assunto": "Migrações",
    "pergunta": "Refugiados são pessoas que:",
    "alternativas": [
      "Precisam de proteção ao fugir de perseguições ou conflitos e outras situações previstas em normas",
      "Viajam sempre apenas para turismo",
      "Mudam por lazer obrigatoriamente",
      "Nunca atravessam fronteiras"
    ],
    "correta": 0,
    "explicacao": "A proteção de refugiados decorre de normas nacionais e internacionais."
  },
  {
    "id": "a2f6b94d933af512",
    "materia": "Geografia",
    "assunto": "Demografia",
    "pergunta": "Taxa de natalidade relaciona-se ao número de:",
    "alternativas": [
      "Nascimentos em uma população",
      "Indústrias em um país",
      "Escolas por bairro",
      "Rios por região"
    ],
    "correta": 0,
    "explicacao": "A natalidade considera nascimentos em certo território e período."
  },
  {
    "id": "6fd21670a32d24db",
    "materia": "Geografia",
    "assunto": "Demografia",
    "pergunta": "O crescimento vegetativo resulta da diferença entre:",
    "alternativas": [
      "Natalidade e mortalidade",
      "Exportações e importações",
      "Renda e consumo",
      "Migração e turismo apenas"
    ],
    "correta": 0,
    "explicacao": "Crescimento vegetativo desconsidera o saldo migratório."
  },
  {
    "id": "76b12f104aba58d0",
    "materia": "Geografia",
    "assunto": "Demografia",
    "pergunta": "Uma pirâmide etária representa:",
    "alternativas": [
      "Distribuição por idade e sexo de uma população",
      "As principais rodovias de um país",
      "Dados de precipitação por rio",
      "O relevo de uma cidade"
    ],
    "correta": 0,
    "explicacao": "A pirâmide etária ajuda a estudar estrutura demográfica."
  },
  {
    "id": "fea03da577732a95",
    "materia": "Geografia",
    "assunto": "América Latina",
    "pergunta": "Qual idioma é predominante no Brasil?",
    "alternativas": [
      "Português",
      "Espanhol",
      "Inglês",
      "Francês"
    ],
    "correta": 0,
    "explicacao": "A língua oficial do Brasil é o português, com diversidade de línguas indígenas e outras."
  },
  {
    "id": "4e4325192723e029",
    "materia": "Geografia",
    "assunto": "América Latina",
    "pergunta": "A América Latina foi marcada historicamente por:",
    "alternativas": [
      "Colonização, diversidade cultural e desigualdades sociais",
      "Um único povo e língua",
      "Ausência de movimentos de independência",
      "Economias idênticas"
    ],
    "correta": 0,
    "explicacao": "A região reúne histórias distintas de colonização, formação social e economia."
  },
  {
    "id": "97996114670bd316",
    "materia": "Geografia",
    "assunto": "América Latina",
    "pergunta": "Qual país latino-americano tem sua capital em Buenos Aires?",
    "alternativas": [
      "Argentina",
      "Chile",
      "México",
      "Peru"
    ],
    "correta": 0,
    "explicacao": "Buenos Aires é a capital da Argentina."
  },
  {
    "id": "952f73087c61bbff",
    "materia": "Geografia",
    "assunto": "América Latina",
    "pergunta": "Qual cordilheira se estende pelo oeste da América do Sul?",
    "alternativas": [
      "Andes",
      "Himalaia",
      "Alpes",
      "Montes Urais"
    ],
    "correta": 0,
    "explicacao": "Os Andes acompanham grande parte da faixa ocidental sul-americana."
  },
  {
    "id": "f9dc7e069628d806",
    "materia": "Geografia",
    "assunto": "América do Norte",
    "pergunta": "Quais países integram a América do Norte na divisão geográfica mais comum?",
    "alternativas": [
      "Canadá, Estados Unidos e México",
      "Brasil, Chile e Peru",
      "França, Espanha e Portugal",
      "Egito, Nigéria e Marrocos"
    ],
    "correta": 0,
    "explicacao": "A divisão usual da América do Norte inclui Canadá, EUA e México."
  },
  {
    "id": "7f8fcda540376121",
    "materia": "Geografia",
    "assunto": "América do Norte",
    "pergunta": "O USMCA/T-MEC está associado à integração comercial de:",
    "alternativas": [
      "México, Estados Unidos e Canadá",
      "Brasil, Argentina e Uruguai",
      "Alemanha, França e Itália",
      "Japão, China e Coreia do Sul"
    ],
    "correta": 0,
    "explicacao": "O acordo comercial substituiu o antigo NAFTA, entre os três países norte-americanos."
  },
  {
    "id": "b011b6a6e1b2b11e",
    "materia": "Geografia",
    "assunto": "África",
    "pergunta": "O continente africano caracteriza-se por:",
    "alternativas": [
      "Grande diversidade de povos, línguas, climas e paisagens",
      "Uma única cultura e idioma",
      "Somente clima desértico",
      "Ausência de centros urbanos"
    ],
    "correta": 0,
    "explicacao": "A África é diversa em ambientes e experiências históricas."
  },
  {
    "id": "dbf6612946cb2de6",
    "materia": "Geografia",
    "assunto": "África",
    "pergunta": "O Saara situa-se predominantemente na:",
    "alternativas": [
      "Região norte da África",
      "Europa oriental",
      "Oceania",
      "América Central"
    ],
    "correta": 0,
    "explicacao": "O Saara é um grande deserto do norte africano."
  },
  {
    "id": "06b906d244e8e5f1",
    "materia": "Geografia",
    "assunto": "África",
    "pergunta": "A savana é uma paisagem com predominância de:",
    "alternativas": [
      "Gramíneas e árvores dispersas",
      "Gelo permanente em toda parte",
      "Floresta densa apenas",
      "Ausência completa de seres vivos"
    ],
    "correta": 0,
    "explicacao": "Savanas combinam vegetação herbácea com árvores e arbustos em diferentes proporções."
  },
  {
    "id": "37eb71e0d3bf8be9",
    "materia": "Geografia",
    "assunto": "África",
    "pergunta": "Por que generalizar a África como se fosse um único país é incorreto?",
    "alternativas": [
      "Porque é um continente formado por muitos países e povos",
      "Porque não possui cidades",
      "Porque todos falam a mesma língua",
      "Porque não há fronteiras"
    ],
    "correta": 0,
    "explicacao": "O continente reúne Estados, culturas e realidades socioeconômicas diversas."
  },
  {
    "id": "c298aeeb6ffdd505",
    "materia": "Geografia",
    "assunto": "África e colonialismo",
    "pergunta": "Uma consequência da colonização europeia na África foi:",
    "alternativas": [
      "Imposição de fronteiras e exploração de recursos",
      "Eliminação de toda desigualdade",
      "Ausência de resistência africana",
      "Fim das migrações"
    ],
    "correta": 0,
    "explicacao": "Os processos coloniais alteraram territórios e sociedades, enfrentando resistências."
  },
  {
    "id": "5d223ea7b62539b1",
    "materia": "Geografia",
    "assunto": "Geopolítica",
    "pergunta": "O que é território em Geografia política?",
    "alternativas": [
      "Espaço sobre o qual se exercem relações de poder",
      "Apenas um tipo de rocha",
      "Somente um rio",
      "Qualquer objeto sem localização"
    ],
    "correta": 0,
    "explicacao": "Território envolve apropriação, controle e relações de poder."
  },
  {
    "id": "1ddc1f24e0aa61e9",
    "materia": "Geografia",
    "assunto": "Geopolítica",
    "pergunta": "O termo fronteira pode indicar:",
    "alternativas": [
      "Limites e zonas de interação entre territórios",
      "Somente montanhas",
      "Apenas linhas do Equador",
      "A ausência de Estados"
    ],
    "correta": 0,
    "explicacao": "Fronteiras podem separar e também conectar povos e economias."
  },
  {
    "id": "0a675e98b73d8d9a",
    "materia": "Geografia",
    "assunto": "Economia",
    "pergunta": "O setor primário da economia inclui:",
    "alternativas": [
      "Agricultura, pecuária e extrativismo",
      "Apenas bancos",
      "Somente programação de software",
      "Somente hospitais"
    ],
    "correta": 0,
    "explicacao": "O setor primário extrai ou produz recursos diretamente da natureza."
  },
  {
    "id": "407b557adcd51a81",
    "materia": "Geografia",
    "assunto": "Economia",
    "pergunta": "O setor terciário concentra principalmente:",
    "alternativas": [
      "Comércio e serviços",
      "Mineração e pesca",
      "Produção agrícola",
      "Extração de petróleo"
    ],
    "correta": 0,
    "explicacao": "O terciário reúne atividades de comércio e prestação de serviços."
  },
  {
    "id": "5b3b0e9e103a59b8",
    "materia": "Geografia",
    "assunto": "Urbanização",
    "pergunta": "Um desafio urbano relacionado ao crescimento rápido das cidades é:",
    "alternativas": [
      "Necessidade de moradia, saneamento e mobilidade",
      "Desaparecimento de todo transporte",
      "Ausência de consumo de água",
      "Falta absoluta de atividades econômicas"
    ],
    "correta": 0,
    "explicacao": "O crescimento urbano exige infraestrutura e planejamento."
  },
  {
    "id": "536947b4a9f11da8",
    "materia": "Geografia",
    "assunto": "Cartografia",
    "pergunta": "O que representa a escala de um mapa?",
    "alternativas": [
      "Relação entre distância no mapa e distância real",
      "Quantidade de idiomas de um país",
      "Número de habitantes por cidade",
      "Altura de todos os prédios"
    ],
    "correta": 0,
    "explicacao": "Escalas permitem converter medidas cartográficas em distâncias do terreno."
  },
  {
    "id": "9c3ead1a30272b69",
    "materia": "Geografia",
    "assunto": "Cartografia",
    "pergunta": "Em um mapa, uma legenda serve para:",
    "alternativas": [
      "Explicar o significado de símbolos e cores",
      "Substituir todas as coordenadas",
      "Indicar somente o norte",
      "Esconder informações"
    ],
    "correta": 0,
    "explicacao": "Legendas ajudam a interpretar elementos representados."
  },
  {
    "id": "4961c5329409accf",
    "materia": "Geografia",
    "assunto": "Ambiente",
    "pergunta": "O desmatamento pode afetar:",
    "alternativas": [
      "Biodiversidade, clima local e disponibilidade de água",
      "Somente o número de carros",
      "A distância Terra-Lua",
      "A velocidade da luz"
    ],
    "correta": 0,
    "explicacao": "Mudanças no uso da terra podem alterar sistemas ecológicos e climáticos."
  },
  {
    "id": "809a7a7167fdd9d2",
    "materia": "Geografia",
    "assunto": "Ambiente",
    "pergunta": "Uma alternativa para reduzir impactos da urbanização é:",
    "alternativas": [
      "Ampliar saneamento e planejamento urbano",
      "Descartar lixo nos rios",
      "Reduzir áreas verdes sempre",
      "Ignorar transporte coletivo"
    ],
    "correta": 0,
    "explicacao": "Saneamento e planejamento contribuem para qualidade ambiental e social."
  },
  {
    "id": "f5b9d0fed44c6f3d",
    "materia": "Geografia",
    "assunto": "Indicadores sociais",
    "pergunta": "O IDH utiliza dimensões relacionadas a:",
    "alternativas": [
      "Saúde, educação e renda",
      "Somente área territorial",
      "Apenas número de fábricas",
      "Quantidade de fronteiras"
    ],
    "correta": 0,
    "explicacao": "O IDH sintetiza indicadores de desenvolvimento humano."
  },
  {
    "id": "7d97c57a1d027580",
    "materia": "Geografia",
    "assunto": "Desigualdades",
    "pergunta": "Ao comparar países, PIB alto por si só significa distribuição de renda justa?",
    "alternativas": [
      "Não, é necessário analisar outros indicadores",
      "Sim, sempre",
      "Sim, se houver litoral",
      "Sim, se existir indústria"
    ],
    "correta": 0,
    "explicacao": "Produção econômica total não indica como a renda é distribuída."
  },
  {
    "id": "d3d1c00c5d6e689d",
    "materia": "Matemática",
    "assunto": "Estatística",
    "pergunta": "Uma pesquisa ouviu 40 estudantes de uma escola que tem 400 alunos. Os 40 estudantes representam:",
    "alternativas": [
      "A população inteira",
      "Uma amostra",
      "Uma variável",
      "Uma frequência"
    ],
    "correta": 1,
    "explicacao": "A amostra é uma parte da população. A população investigada é o conjunto dos 400 alunos."
  },
  {
    "id": "0c858d6e5a9c73ae",
    "materia": "Matemática",
    "assunto": "Porcentagem",
    "pergunta": "Um produto custa R$ 80 e recebe desconto de 25%. Qual é o preço após o desconto?",
    "alternativas": [
      "R$ 20",
      "R$ 55",
      "R$ 60",
      "R$ 65"
    ],
    "correta": 2,
    "explicacao": "25% de 80 = 20. Então, 80 − 20 = R$ 60."
  },
  {
    "id": "4a99d874471e618d",
    "materia": "Matemática",
    "assunto": "Estatística",
    "pergunta": "Uma tabela mostra 12, 15 e 18 alunos em três grupos. Qual é o total?",
    "alternativas": [
      "35",
      "45",
      "40",
      "55"
    ],
    "correta": 1,
    "explicacao": "12 + 15 + 18 = 45. Some as frequências para encontrar o total."
  },
  {
    "id": "2abd99d10d458539",
    "materia": "Língua Portuguesa",
    "assunto": "Argumentação",
    "pergunta": "Qual elemento apresenta a opinião central que será defendida em um texto dissertativo-argumentativo?",
    "alternativas": [
      "A tese",
      "A legenda",
      "A bibliografia",
      "O título apenas"
    ],
    "correta": 0,
    "explicacao": "A tese é o ponto de vista central defendido pelo autor por meio de argumentos."
  },
  {
    "id": "35cc0dce7407971b",
    "materia": "Língua Portuguesa",
    "assunto": "Coesão textual",
    "pergunta": "Em “Marina comprou um livro. Ela começou a lê-lo”, o pronome “Ela” retoma Marina. Esse recurso é:",
    "alternativas": [
      "Catáfora",
      "Anáfora",
      "Elipse",
      "Hipérbole"
    ],
    "correta": 1,
    "explicacao": "Anáfora retoma uma informação apresentada anteriormente no texto."
  },
  {
    "id": "0cf9c18bb9ba36e6",
    "materia": "Língua Portuguesa",
    "assunto": "Compreensão textual",
    "pergunta": "Qual alternativa apresenta um exemplo de texto expositivo?",
    "alternativas": [
      "Um texto que apresenta informações e explica como funciona o ciclo da água",
      "Uma campanha que tenta convencer o leitor a comprar algo",
      "Um conto de fantasia",
      "Um diálogo teatral"
    ],
    "correta": 0,
    "explicacao": "O texto expositivo tem como objetivo informar e explicar um assunto."
  },
  {
    "id": "7172ee8cfd81a916",
    "materia": "Geografia",
    "assunto": "Regiões polares",
    "pergunta": "Qual afirmação diferencia corretamente Ártico e Antártida?",
    "alternativas": [
      "Ambos são continentes habitados permanentemente",
      "O Ártico é oceano cercado por terras; a Antártida é um continente",
      "A Antártida fica no Polo Norte",
      "O Ártico não possui população"
    ],
    "correta": 1,
    "explicacao": "O Ártico é uma região polar setentrional centrada no Oceano Glacial Ártico. A Antártida é um continente no extremo sul."
  },
  {
    "id": "a9dfa9ee10e8ff1e",
    "materia": "Geografia",
    "assunto": "Desigualdades",
    "pergunta": "O movimento Black Lives Matter está relacionado principalmente:",
    "alternativas": [
      "À defesa do colonialismo",
      "Ao combate ao racismo e à violência racial",
      "À exploração do Ártico",
      "À expansão do turismo polar"
    ],
    "correta": 1,
    "explicacao": "Black Lives Matter é um movimento que denuncia o racismo e reivindica igualdade e justiça para pessoas negras."
  },
  {
    "id": "0a398094dd7224f8",
    "materia": "Geografia",
    "assunto": "Geopolítica",
    "pergunta": "Por que o Ártico tem importância geopolítica?",
    "alternativas": [
      "Por não possuir recursos naturais",
      "Pelo interesse em recursos, rotas marítimas e influência territorial",
      "Porque é um continente sem países próximos",
      "Porque não sofre mudanças ambientais"
    ],
    "correta": 1,
    "explicacao": "Recursos naturais, rotas marítimas, soberania e mudanças ambientais tornam a região estratégica."
  },
  {
    "id": "b373a5eedbc0fddd",
    "materia": "Educação Física",
    "assunto": "Saúde e movimento",
    "pergunta": "Como se calcula o IMC?",
    "alternativas": [
      "Altura dividida pelo peso",
      "Peso dividido pela altura ao quadrado",
      "Peso multiplicado pela idade",
      "Altura ao quadrado dividida pela idade"
    ],
    "correta": 1,
    "explicacao": "A fórmula é IMC = peso (kg) ÷ altura² (m²). Em adolescentes, a interpretação precisa considerar idade e sexo."
  },
  {
    "id": "1cb3718963add6c2",
    "materia": "Educação Física",
    "assunto": "Saúde e movimento",
    "pergunta": "Qual situação exemplifica um comportamento sedentário durante o tempo em que estamos acordados?",
    "alternativas": [
      "Correr durante uma brincadeira",
      "Passar um longo período sentado assistindo a vídeos",
      "Subir vários lances de escada",
      "Dançar durante o recreio"
    ],
    "correta": 1,
    "explicacao": "Ficar sentado, reclinado ou deitado com baixo gasto de energia enquanto se está acordado caracteriza comportamento sedentário. Uma pessoa pode praticar exercícios e também passar muitas horas sentada."
  },
  {
    "id": "61d1d23aee25a222",
    "materia": "Educação Física",
    "assunto": "Saúde e movimento",
    "pergunta": "O gasto energético do corpo está relacionado:",
    "alternativas": [
      "Somente ao sono",
      "À energia usada nas funções vitais e nas atividades",
      "Apenas à altura",
      "Somente à prática de atletismo"
    ],
    "correta": 1,
    "explicacao": "O corpo gasta energia para manter funções vitais e realizar movimentos e atividades."
  },
  {
    "id": "80d517124cedd622",
    "materia": "História",
    "assunto": "Primeiro Reinado",
    "pergunta": "Quem governou o Brasil durante o Primeiro Reinado?",
    "alternativas": [
      "D. Pedro I",
      "D. Pedro II",
      "Deodoro da Fonseca",
      "Getúlio Vargas"
    ],
    "correta": 0,
    "explicacao": "O Primeiro Reinado corresponde ao governo de D. Pedro I, de 1822 a 1831."
  },
  {
    "id": "0de75c20e97997ce",
    "materia": "História",
    "assunto": "Período Regencial",
    "pergunta": "O Período Regencial começou porque:",
    "alternativas": [
      "O Brasil deixou de ser independente",
      "D. Pedro II ainda era menor de idade quando D. Pedro I abdicou",
      "A República foi proclamada",
      "A Constituição de 1824 foi anulada imediatamente"
    ],
    "correta": 1,
    "explicacao": "Com a abdicação de D. Pedro I em 1831, seu filho era menor de idade; o país passou a ser governado por regentes."
  },
  {
    "id": "3cb815354919866f",
    "materia": "História",
    "assunto": "Período Regencial",
    "pergunta": "O Ato Adicional de 1834 está ligado a mudanças:",
    "alternativas": [
      "Na organização política do Período Regencial",
      "Na proclamação da República",
      "Na independência do Brasil",
      "Na abolição da escravidão"
    ],
    "correta": 0,
    "explicacao": "O Ato Adicional alterou a Constituição de 1824 e ampliou a autonomia provincial, entre outras mudanças."
  },
  {
    "id": "1e5ae36364322b3c",
    "materia": "Inglês",
    "assunto": "Present perfect",
    "pergunta": "Complete: “I have lived here ___ 2020.”",
    "alternativas": [
      "for",
      "since",
      "yet",
      "ever"
    ],
    "correta": 1,
    "explicacao": "SINCE é usado com o ponto de início: since 2020. FOR indica duração, como for three years."
  },
  {
    "id": "f092bb5616d84338",
    "materia": "Inglês",
    "assunto": "Present perfect",
    "pergunta": "Qual frase usa corretamente o Present Perfect?",
    "alternativas": [
      "She have finished.",
      "She has finished.",
      "She did finished.",
      "She has finish."
    ],
    "correta": 1,
    "explicacao": "Com he, she e it usamos HAS + particípio passado: has finished."
  },
  {
    "id": "7a9c39f2273628ed",
    "materia": "Inglês",
    "assunto": "Present perfect",
    "pergunta": "Em uma pergunta sobre experiência de vida, qual palavra é comum?",
    "alternativas": [
      "EVER",
      "YESTERDAY",
      "AGO",
      "LAST"
    ],
    "correta": 0,
    "explicacao": "EVER é usado em perguntas sobre experiências: Have you ever visited...?"
  },
  {
    "id": "214430cf7481beaf",
    "materia": "Ciências",
    "assunto": "Puberdade",
    "pergunta": "A puberdade é:",
    "alternativas": [
      "Um processo idêntico e na mesma idade para todos",
      "Uma fase de mudanças corporais relacionadas à maturação",
      "Uma doença",
      "O fim do desenvolvimento humano"
    ],
    "correta": 1,
    "explicacao": "A puberdade envolve mudanças físicas e hormonais, que variam de pessoa para pessoa."
  },
  {
    "id": "31cf6ed2c257d9ad",
    "materia": "Ciências",
    "assunto": "Saúde e prevenção",
    "pergunta": "Qual opção ajuda a reduzir o risco de várias ISTs?",
    "alternativas": [
      "Compartilhar objetos pessoais",
      "Usar preservativos corretamente e buscar informação de saúde confiável",
      "Ignorar sintomas",
      "Tomar medicamentos sem orientação"
    ],
    "correta": 1,
    "explicacao": "Preservativos reduzem o risco de muitas ISTs. Testagem, vacinação quando indicada e orientação de profissionais também são importantes."
  },
  {
    "id": "4a58e216bc7f2eb3",
    "materia": "Ciências",
    "assunto": "Saúde e prevenção",
    "pergunta": "O que significa consentimento?",
    "alternativas": [
      "Concordância livre, informada e que pode ser retirada",
      "Aceitar algo por pressão",
      "Não poder mudar de ideia",
      "Uma obrigação em qualquer relacionamento"
    ],
    "correta": 0,
    "explicacao": "Consentimento exige liberdade e respeito; pode ser retirado a qualquer momento. Pressão não é consentimento."
  },
  {
    "id": "b5f23085c715d155",
    "materia": "Arte",
    "assunto": "História da arte",
    "pergunta": "Uma característica frequentemente associada ao Modernismo é:",
    "alternativas": [
      "Manter sempre as regras acadêmicas tradicionais",
      "Experimentar novas linguagens e romper padrões artísticos anteriores",
      "Rejeitar qualquer tema social",
      "Usar apenas esculturas clássicas"
    ],
    "correta": 1,
    "explicacao": "O Modernismo buscou inovação formal e novas maneiras de representar o mundo."
  },
  {
    "id": "730d7ecc2b2b8ee0",
    "materia": "Arte",
    "assunto": "Leitura de imagens",
    "pergunta": "Grafite, teatro político e música de protesto podem:",
    "alternativas": [
      "Expressar críticas e reflexões sobre a sociedade",
      "Ter somente função decorativa",
      "Não ter relação com seu contexto histórico",
      "Ser sempre manifestações sem público"
    ],
    "correta": 0,
    "explicacao": "Diferentes linguagens artísticas podem comunicar ideias, identidades, críticas e reivindicações."
  },
  {
    "id": "de92dae086a10acd",
    "materia": "Arte",
    "assunto": "Música",
    "pergunta": "Heitor Villa-Lobos é conhecido principalmente por sua atuação como:",
    "alternativas": [
      "Pintor modernista",
      "Compositor e maestro brasileiro",
      "Atleta olímpico",
      "Diretor do Cinema Novo"
    ],
    "correta": 1,
    "explicacao": "Villa-Lobos foi um importante compositor brasileiro, associado à valorização de elementos da cultura musical do país."
  }
];
