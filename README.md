# Hemope ID — execução com Docker

Protótipo demonstrativo de identificação de doadores por NFC e gerenciamento de fila. Utilize exclusivamente dados fictícios.

## Requisitos
- Docker Desktop (Windows/macOS) ou Docker Engine + Docker Compose (Linux)
- Navegador atualizado

Não é necessário instalar Node.js nem PostgreSQL no computador: os serviços são executados em contêineres.

## Como iniciar
1. Extraia a pasta `Hemope-ID`.
2. Abra um terminal dentro dela (na mesma pasta deste README).
3. Execute:

```bash
docker compose up --build -d
```

4. Aguarde a inicialização e acesse `http://localhost:5173`.

Na primeira inicialização, o backend cria a estrutura do banco e carrega os dados fictícios automaticamente.

## Usuários de demonstração
Senha para todos: `Hemope@123`

| Perfil | E-mail |
|---|---|
| Administrador | admin@hemope.local |
| Atendente | recepcao@hemope.local |
| Profissional de saúde | saude@hemope.local |

## Serviços e endereços
- Aplicação web: `http://localhost:5173`
- API: `http://localhost:3333/api/health`
- PostgreSQL: acessível na rede interna do Docker; porta padrão 5432 não é publicada no computador host.

## Comandos úteis
Ver logs de todos os serviços:
```bash
docker compose logs -f
```

Ver logs apenas do backend:
```bash
docker compose logs -f api
```

Parar os serviços, preservando o banco:
```bash
docker compose down
```

Iniciar novamente:
```bash
docker compose up -d
```

Reconstruir as imagens após alterações no código:
```bash
docker compose up --build -d
```

**Apagar o banco e recriar os dados fictícios do zero** (esta ação apaga os dados armazenados):
```bash
docker compose down -v
docker compose up --build -d
```

## Acesso pelo computador, celular e iPad/TV

Todos os dispositivos precisam acessar o mesmo servidor Hemope ID.

- **Computador da recepção:** abra `http://localhost:5173` e entre com o usuário de recepção.
- **Celular Android para NFC:** no mesmo Wi-Fi, abra `http://IP-DO-COMPUTADOR:5173`, entre com o usuário da recepção e acesse **Identificação NFC**. Ao ler um cartão já associado, o cadastro é localizado no celular e o computador da recepção recebe a identificação automaticamente pelo servidor.
- **iPad ou Smart TV:** abra `http://IP-DO-COMPUTADOR:5173/tv`. Essa tela é pública e mostra somente as senhas, sem nome, CPF ou dados dos doadores. Ela atualiza automaticamente quando o profissional chama, repete ou finaliza uma senha.

Para descobrir o IP local do computador no Windows, execute `ipconfig` no Prompt de Comando e procure o endereço IPv4 da conexão Wi-Fi/Ethernet. Libere as portas 5173 e 3333 no firewall se o Windows solicitar. Não use `localhost` no iPad ou celular: nesse dispositivo, `localhost` aponta para o próprio aparelho, não para o computador servidor.

A tela `/tv` foi dimensionada para monitor, Smart TV e iPad em modo paisagem e pode ser colocada em tela cheia pelo navegador. O computador do profissional controla as chamadas pelo menu **Painel médico**; o iPad/TV apenas acompanha a fila em tempo real.

## Exclusão de cadastro

Na ficha do doador existe a opção **Excluir cadastro**. Por segurança do histórico, ela arquiva o cadastro: ele deixa de aparecer nas buscas e não pode receber novas visitas, mas os atendimentos anteriores são preservados. A ação pede confirmação.

## NFC em Android e iPhone (sem instalar o Hemope ID)

O Hemope ID é acessado pelo navegador. Cada cartão recebe uma URL exclusiva com um token aleatório; o cartão não armazena nome, CPF nem informação de saúde.

### Preparar e gravar um cartão pelo iPhone 12
1. No computador, abra o Hemope ID pelo endereço que também será acessível no iPhone (por exemplo, `http://192.168.0.110:5173`, se ambos estiverem na mesma rede Wi-Fi). Não use `localhost` ao gerar o link.
2. Entre como recepção, cadastre o doador ou localize um cadastro fictício de teste.
3. Na ficha do doador, clique em **Gerar link seguro para o cartão NFC**.
4. Clique em **Copiar link para NFC Tools (iPhone)**.
5. No iPhone, instale/abra NFC Tools, escolha **Escrever** → **Adicionar um registro** → **URL/URI**, cole o link copiado e escolha **Escrever**.
6. Aproxime a etiqueta NTAG215 da parte superior traseira do iPhone até o aplicativo confirmar a gravação.
7. Para testar, aproxime novamente a etiqueta do iPhone. O iOS deverá apresentar uma notificação; toque nela para abrir o link no Safari. A página `/nfc/<token>` envia a identificação à recepção em tempo real.

O iPhone XS e posteriores, incluindo iPhone 12, oferecem leitura de tags NFC em segundo plano quando as condições do iOS são atendidas. O usuário precisa tocar na notificação. O Safari não oferece a API Web NFC: a leitura é iniciada pelo iOS ao detectar uma tag com registro URI/URL, e não por um botão dentro da página. A gravação é feita pelo NFC Tools.

### Android
- Android compatível: Chrome com NFC habilitado e sistema em HTTPS para usar Web NFC. Na ficha do doador, gere o link e use **Gravar cartão (Android compatível)**. Para ler depois, abra **Identificação NFC**, selecione **Leitura real**, toque em **Iniciar leitura** e aproxime o cartão.

### Limitações e segurança
- Para o iPhone abrir a URL, o endereço gravado precisa ser alcançável pelo iPhone. Em teste local, mantenha computador e iPhone na mesma rede Wi-Fi e use o IP local do computador. Para uso fora da rede local, publique o sistema em domínio com HTTPS válido.
- O iPhone pode não apresentar notificação se a leitura NFC em segundo plano estiver indisponível naquele momento (por exemplo, câmera ativa, modo avião ou certas condições de bloqueio/uso); desbloqueie o aparelho e tente novamente.
- Celulares sem NFC compatível devem usar busca manual ou QR Code. Não existe uma API de navegador que leia NFC fisicamente em todos os modelos.
- Trate o cartão como uma credencial: se for perdido, gere um novo token e invalide a associação anterior. O endpoint público de leitura é demonstrativo e precisa de controles adicionais, limitação de tentativas, revogação e validação institucional antes de produção. Use exclusivamente dados fictícios até concluir avaliação de segurança e LGPD.

## E-mail (opcional)
O envio de e-mail fica desativado quando não há SMTP configurado. Para habilitar, crie um arquivo `.env` na raiz com as variáveis abaixo e reinicie os serviços:

```env
SMTP_HOST=servidor.smtp
SMTP_PORT=587
SMTP_USER=seu_usuario
SMTP_PASS=sua_senha
SMTP_FROM=Hemope ID <nao-responda@exemplo.com>
```

## Painel iPad/TV
Abra diretamente `http://IP-DO-COMPUTADOR:5173/tv` no navegador do iPad/TV. O painel atualiza as chamadas em tempo real via Socket.IO e não apresenta dados pessoais dos doadores. Também é possível abrir pelo menu **Tela da TV** após entrar no sistema.

## Observações
- Este projeto é um protótipo acadêmico/demonstrativo, não um sistema oficial do Hemope.
- Não insira dados reais de doadores. Antes de qualquer uso institucional, são necessárias avaliação técnica, validação dos processos oficiais, testes de segurança, adequação à LGPD, HTTPS e infraestrutura apropriada.
- A Web NFC API não é suportada por todos os navegadores/dispositivos. A simulação está identificada na interface e não representa leitura física.
- O seed é executado automaticamente apenas quando o banco ainda não possui usuários; reiniciar os contêineres não apaga os registros existentes.

## Gerenciamento de doadores (implementação revisada)

- **Doadores do Dia** consulta os atendimentos efetivamente registrados na data local de Recife. Uma leitura NFC apenas localiza o cadastro e envia a identificação à recepção; a visita só entra na lista após confirmação do atendente.
- **Todos os Doadores** consulta os cadastros permanentes, incluindo os arquivados. O arquivamento não apaga o cadastro nem o histórico.
- O CPF é normalizado para somente números e possui unicidade no PostgreSQL quando informado. CPF vazio é armazenado como `NULL`, permitindo cadastro sem CPF sem tratar nomes iguais como duplicidade.
- A API bloqueia CPF já existente e, em caso de duas requisições concorrentes, a restrição `UNIQUE` do banco impede a segunda gravação. O frontend abre o cadastro já existente quando recebe o conflito.
- A geração de novo cartão não substitui silenciosamente um token NFC já associado. A leitura NFC continua sem criar visita automaticamente.
- A numeração usa a data local `America/Recife`; assim, ao mudar o dia local, a primeira senha volta a 001 e os registros anteriores permanecem consultáveis.
- O campo CPF é mascarado nas respostas para o perfil de atendente; o perfil administrador recebe o valor completo.

### Atualização do banco

O `docker-compose.yml` já executa `prisma db push` na inicialização. Após substituir os arquivos, execute `docker compose up --build -d` para aplicar o campo `identificationMethod` e tornar `Donor.cpf` opcional e único no banco. Não execute `docker compose down -v`, pois esse comando apaga os dados persistidos.

### Validação manual recomendada

1. Cadastre um doador com CPF e confira Todos os Doadores.
2. Tente cadastrar novamente o mesmo CPF com pontuação diferente; a API deve retornar conflito e o frontend deve abrir o cadastro existente.
3. Cadastre duas pessoas sem CPF e com nomes iguais; ambas devem ser permitidas.
4. Leia um cartão NFC já associado; confira que o cadastro aparece na recepção, mas ainda não em Doadores do Dia.
5. Confirme a visita e confira senha, horário, situação e método NFC em Doadores do Dia.
6. Registre uma visita manual e confira o método Manual.
7. Arquive um cadastro e confirme que ele continua em Todos os Doadores e no histórico.
8. Verifique a mudança de data local: a nova data inicia a senha em 001 e os atendimentos do dia anterior continuam armazenados.

> O ambiente de execução desta revisão não possui Docker e a instalação das dependências npm não foi concluída dentro do tempo disponível. Portanto, as alterações de código foram realizadas, mas a compilação e os testes de integração precisam ser executados no computador com Docker Desktop antes de qualquer uso. O protótipo continua destinado a dados fictícios; não utilize dados reais de saúde ou CPF sem validação institucional, controles de acesso, auditoria e avaliação LGPD.

## Atualização: expedientes e fila

As rotas `/api/shifts/current`, `/api/shifts`, `/api/shifts/open` e `/api/shifts/close` controlam expedientes persistidos. Para encerrar, envie `POST /api/shifts/close` com `{"confirm":true}` e autenticação de ADMIN ou ATENDENTE. A abertura e o encerramento utilizam bloqueio transacional PostgreSQL para evitar operações simultâneas. As senhas são numeradas por expediente, e o histórico de visitas é preservado.

**Atualização de banco existente:** faça backup do volume PostgreSQL antes de atualizar. O comando atual do Compose executa `prisma db push`, que sincroniza o esquema sem usar uma migração versionada. Verifique o resultado do comando e não aceite qualquer sugestão de reset do banco. A nova relação opcional `Visit.shiftId` mantém as visitas antigas sem expediente atribuído; elas continuam no histórico geral, mas não são atribuídas retroativamente a um expediente sem dados confiáveis. Para implantação em produção, recomenda-se criar e revisar uma migração SQL versionada em ambiente de homologação.

Comandos: `docker compose up -d --build`; `docker compose logs -f api`; `docker compose ps`. Acesse `http://localhost:5173` no computador ou `http://IP-DO-COMPUTADOR:5173` na rede local. O Docker não estava disponível no ambiente de edição; testes de integração com PostgreSQL, Web NFC e dispositivos físicos ainda precisam ser executados.


## Correção da inicialização da API (Prisma)

A versão anterior tentava criar `UNIQUE (shiftId, ticketNumber)` usando `prisma db push`,
que recusava a operação por possível perda de dados e deixava a API parada.
Esta versão usa um índice normal para a consulta de senhas, sem exigir
`--accept-data-loss`. A atribuição de senhas continua protegida por transação
serializável e `pg_advisory_xact_lock` no endpoint de registro de visitas.

**Limitação:** a unicidade não é imposta por uma constraint SQL nesta versão.
Caso outras aplicações gravem diretamente na tabela Visit, elas devem respeitar
a regra ou implementar uma migração de unicidade após auditar os registros legados.

Para atualizar: faça backup do banco, substitua os arquivos do projeto e execute
`docker compose up -d --build`. Consulte `docker compose logs --tail=100 api`
para confirmar que a API iniciou. Não execute `docker compose down -v` e
não utilize `prisma db push --accept-data-loss`.
