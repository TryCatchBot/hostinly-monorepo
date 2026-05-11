2026-05-11T10:11:31.467270041Z [inf]  Starting Container
2026-05-11T10:11:32.845687574Z [inf]  ◇ injected env (0) from .env // tip: ⌘ enable debugging { debug: true }
2026-05-11T10:11:32.845692324Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:32.845696755Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:32.845701087Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:32.845704606Z [err]                                                                              ^
2026-05-11T10:11:32.845708476Z [err]  
2026-05-11T10:11:32.845713131Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:32.845718027Z [err]  
2026-05-11T10:11:32.845722370Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:32.845726062Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:32.845730048Z [err]  
2026-05-11T10:11:32.845733838Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:32.845738401Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:32.845742530Z [err]  
2026-05-11T10:11:32.845746294Z [err]  The following locations have been searched:
2026-05-11T10:11:32.845750247Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:32.845754215Z [err]    /app
2026-05-11T10:11:32.845758163Z [err]    /.prisma/client
2026-05-11T10:11:32.845762369Z [err]    /tmp/prisma-engines
2026-05-11T10:11:32.845767055Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:32.845771271Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:34.110622186Z [err]  
2026-05-11T10:11:34.110634301Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:34.110641280Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:34.110647013Z [err]  
2026-05-11T10:11:34.110653580Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:34.110676273Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:34.110683203Z [err]  
2026-05-11T10:11:34.110845399Z [inf]  ◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
2026-05-11T10:11:34.110858089Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:34.110875523Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:34.110879478Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:34.110888601Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:34.110891064Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:34.110898524Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:34.110899807Z [err]                                                                              ^
2026-05-11T10:11:34.110908072Z [err]    errorCode: undefined,
2026-05-11T10:11:34.110916062Z [err]  
2026-05-11T10:11:34.110921280Z [err]    retryable: undefined
2026-05-11T10:11:34.110925481Z [err]  
2026-05-11T10:11:34.110928230Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:34.110936559Z [err]  }
2026-05-11T10:11:34.110944391Z [err]  Node.js v20.20.2
2026-05-11T10:11:35.436728548Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:35.436736608Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:35.436745318Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:35.436751762Z [err]                                                                              ^
2026-05-11T10:11:35.436758311Z [err]  
2026-05-11T10:11:35.436949129Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:35.436960856Z [err]  
2026-05-11T10:11:35.436968855Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:35.437070238Z [err]  The following locations have been searched:
2026-05-11T10:11:35.437075827Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:35.437084176Z [err]    /app
2026-05-11T10:11:35.437089732Z [err]    /.prisma/client
2026-05-11T10:11:35.437095196Z [err]    /tmp/prisma-engines
2026-05-11T10:11:35.437101858Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:35.437108660Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:35.437115687Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:35.437138827Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:35.437147132Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:35.437153109Z [err]    errorCode: undefined,
2026-05-11T10:11:35.437160188Z [err]    retryable: undefined
2026-05-11T10:11:35.437167319Z [err]  }
2026-05-11T10:11:35.437175163Z [err]  
2026-05-11T10:11:35.437180571Z [err]  Node.js v20.20.2
2026-05-11T10:11:35.437187639Z [inf]  ◇ injected env (0) from .env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
2026-05-11T10:11:36.494524300Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:36.494526181Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:36.494538540Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:36.494539590Z [err]    /app
2026-05-11T10:11:36.494540220Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:36.494549458Z [err]    /.prisma/client
2026-05-11T10:11:36.494557937Z [err]    /tmp/prisma-engines
2026-05-11T10:11:36.494561542Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:36.494568049Z [err]  
2026-05-11T10:11:36.494570848Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:36.494577546Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:36.494581706Z [err]  The following locations have been searched:
2026-05-11T10:11:36.494586658Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:36.494595484Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:36.494601758Z [err]  Node.js v20.20.2
2026-05-11T10:11:36.494611900Z [inf]  ◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
2026-05-11T10:11:36.494615126Z [err]    errorCode: undefined,
2026-05-11T10:11:36.494620610Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:36.494625467Z [err]    retryable: undefined
2026-05-11T10:11:36.494633635Z [err]  }
2026-05-11T10:11:36.494640977Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:36.494644131Z [err]  
2026-05-11T10:11:36.494647418Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:36.494652964Z [err]  
2026-05-11T10:11:37.662714537Z [err]                                                                              ^
2026-05-11T10:11:37.662724358Z [err]  
2026-05-11T10:11:37.662731628Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:37.662740161Z [err]  
2026-05-11T10:11:37.662747192Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:37.662753504Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:37.662760334Z [err]  
2026-05-11T10:11:37.662766941Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:37.662775591Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:37.662807097Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:37.662816195Z [err]  
2026-05-11T10:11:37.662825458Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:37.662832597Z [err]  The following locations have been searched:
2026-05-11T10:11:37.662840173Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:37.662847614Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:37.662853884Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:37.662862788Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:37.662877558Z [err]    /app
2026-05-11T10:11:37.662878036Z [err]    errorCode: undefined,
2026-05-11T10:11:37.662892898Z [err]    retryable: undefined
2026-05-11T10:11:37.662895583Z [err]    /.prisma/client
2026-05-11T10:11:37.662904923Z [err]    /tmp/prisma-engines
2026-05-11T10:11:38.894258719Z [err]  }
2026-05-11T10:11:38.894263628Z [err]  
2026-05-11T10:11:38.894268636Z [err]  Node.js v20.20.2
2026-05-11T10:11:38.894272843Z [inf]  ◇ injected env (0) from .env // tip: ⌘ enable debugging { debug: true }
2026-05-11T10:11:38.894277636Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:38.894281992Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:38.894286425Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:38.894290635Z [err]                                                                              ^
2026-05-11T10:11:38.894295168Z [err]  
2026-05-11T10:11:38.894299707Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:38.894304588Z [err]  
2026-05-11T10:11:38.894308952Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:38.894313244Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:38.894317251Z [err]  
2026-05-11T10:11:38.894321367Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:38.894325432Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:38.894329476Z [err]  
2026-05-11T10:11:38.894333884Z [err]  The following locations have been searched:
2026-05-11T10:11:38.894338325Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:38.894342391Z [err]    /app
2026-05-11T10:11:38.894346547Z [err]    /.prisma/client
2026-05-11T10:11:38.894350654Z [err]    /tmp/prisma-engines
2026-05-11T10:11:38.894354481Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:40.000101655Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:40.000106579Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:40.000110789Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:40.000114882Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:40.000119130Z [err]    errorCode: undefined,
2026-05-11T10:11:40.000123311Z [err]    retryable: undefined
2026-05-11T10:11:40.000131870Z [err]  }
2026-05-11T10:11:40.000136707Z [err]  
2026-05-11T10:11:40.000141040Z [err]  Node.js v20.20.2
2026-05-11T10:11:40.000145469Z [inf]  ◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
2026-05-11T10:11:40.000149554Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:40.000154342Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:40.000159175Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:40.000163357Z [err]                                                                              ^
2026-05-11T10:11:40.000167343Z [err]  
2026-05-11T10:11:40.000172048Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:40.000176314Z [err]  
2026-05-11T10:11:40.000180534Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:40.000184530Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:40.000188303Z [err]  
2026-05-11T10:11:40.000192713Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:40.000197030Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:41.181324669Z [err]  
2026-05-11T10:11:41.181330625Z [err]  The following locations have been searched:
2026-05-11T10:11:41.181336634Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:41.181341480Z [err]    /app
2026-05-11T10:11:41.181346437Z [err]    /.prisma/client
2026-05-11T10:11:41.181351284Z [err]    /tmp/prisma-engines
2026-05-11T10:11:41.181356892Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:41.181362468Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:41.181367366Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:41.181372011Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:41.181376171Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:41.181382257Z [err]    errorCode: undefined,
2026-05-11T10:11:41.181388114Z [err]    retryable: undefined
2026-05-11T10:11:41.181393029Z [err]  }
2026-05-11T10:11:41.181398488Z [err]  
2026-05-11T10:11:41.181403033Z [err]  Node.js v20.20.2
2026-05-11T10:11:41.181407247Z [inf]  ◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
2026-05-11T10:11:41.181412027Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:41.181416937Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:41.181421364Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:41.181425576Z [err]                                                                              ^
2026-05-11T10:11:41.181431021Z [err]  
2026-05-11T10:11:41.181436053Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:41.181440625Z [err]  
2026-05-11T10:11:41.181445718Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:42.240981063Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:42.240985941Z [err]  
2026-05-11T10:11:42.240990816Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:42.240995211Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:42.240999748Z [err]  
2026-05-11T10:11:42.241004366Z [err]  The following locations have been searched:
2026-05-11T10:11:42.241009576Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:42.241014085Z [err]    /app
2026-05-11T10:11:42.241018380Z [err]    /.prisma/client
2026-05-11T10:11:42.241022485Z [err]    /tmp/prisma-engines
2026-05-11T10:11:42.241026597Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:42.241067663Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:42.241073713Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:42.241078169Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:42.241082375Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:42.241096327Z [err]    errorCode: undefined,
2026-05-11T10:11:42.241100617Z [err]    retryable: undefined
2026-05-11T10:11:42.241105330Z [err]  }
2026-05-11T10:11:42.241109818Z [err]  
2026-05-11T10:11:42.241114142Z [err]  Node.js v20.20.2
2026-05-11T10:11:42.241118360Z [inf]  ◇ injected env (0) from .env // tip: ⌘ enable debugging { debug: true }
2026-05-11T10:11:42.241133482Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:42.241138361Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:42.241143584Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:43.572194043Z [err]  
2026-05-11T10:11:43.572205554Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:43.572213104Z [err]  
2026-05-11T10:11:43.572219917Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:43.572226969Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:43.572233892Z [err]  
2026-05-11T10:11:43.572240560Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:43.572246429Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:43.572252096Z [err]  
2026-05-11T10:11:43.572257933Z [err]  The following locations have been searched:
2026-05-11T10:11:43.572263720Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:43.572270102Z [err]    /app
2026-05-11T10:11:43.572277172Z [err]    /.prisma/client
2026-05-11T10:11:43.572285082Z [err]    /tmp/prisma-engines
2026-05-11T10:11:43.572291292Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:43.572297552Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:43.572303650Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:43.572312569Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:43.572319015Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:43.572325563Z [err]    errorCode: undefined,
2026-05-11T10:11:43.572331893Z [err]    retryable: undefined
2026-05-11T10:11:43.572494276Z [err]                                                                              ^
2026-05-11T10:11:44.920973519Z [err]  }
2026-05-11T10:11:44.920980593Z [err]  
2026-05-11T10:11:44.920988223Z [err]  Node.js v20.20.2
2026-05-11T10:11:44.920994397Z [inf]  ◇ injected env (0) from .env // tip: ⌘ enable debugging { debug: true }
2026-05-11T10:11:44.921000834Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:44.921007366Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:44.921013876Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:44.921020375Z [err]                                                                              ^
2026-05-11T10:11:44.921026750Z [err]  
2026-05-11T10:11:44.921033047Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:44.921039741Z [err]  
2026-05-11T10:11:44.921045769Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:44.921052385Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:44.921059080Z [err]  
2026-05-11T10:11:44.921066382Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:44.921072574Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:44.921078996Z [err]  
2026-05-11T10:11:44.921084907Z [err]  The following locations have been searched:
2026-05-11T10:11:44.921091064Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:44.921097098Z [err]    /app
2026-05-11T10:11:44.921103539Z [err]    /.prisma/client
2026-05-11T10:11:44.921109978Z [err]    /tmp/prisma-engines
2026-05-11T10:11:44.921116077Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:45.965870320Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:45.965877048Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:45.965882982Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:45.965889014Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:45.965895600Z [err]    errorCode: undefined,
2026-05-11T10:11:45.965903283Z [err]    retryable: undefined
2026-05-11T10:11:45.965912817Z [err]  }
2026-05-11T10:11:45.965921076Z [err]  
2026-05-11T10:11:45.965927289Z [err]  Node.js v20.20.2
2026-05-11T10:11:45.965936578Z [inf]  ◇ injected env (0) from .env // tip: ⌘ override existing { override: true }
2026-05-11T10:11:45.965942708Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:45.965949140Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:45.965955119Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:45.965961090Z [err]                                                                              ^
2026-05-11T10:11:45.965967999Z [err]  
2026-05-11T10:11:45.965975016Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:45.965982901Z [err]  
2026-05-11T10:11:45.965988750Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.
2026-05-11T10:11:45.965994850Z [err]  Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied next to the bundle or in "apps/hostinly-backend/src/generated/client".
2026-05-11T10:11:45.966003744Z [err]  
2026-05-11T10:11:45.966009271Z [err]  We would appreciate if you could take the time to share some information with us.
2026-05-11T10:11:45.966015660Z [err]  Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
2026-05-11T10:11:47.276513619Z [err]  
2026-05-11T10:11:47.276517889Z [err]  The following locations have been searched:
2026-05-11T10:11:47.276522124Z [err]    /app/apps/hostinly-backend/src/generated/client
2026-05-11T10:11:47.276526391Z [err]    /app
2026-05-11T10:11:47.276530560Z [err]    /.prisma/client
2026-05-11T10:11:47.276534570Z [err]    /tmp/prisma-engines
2026-05-11T10:11:47.276538487Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:11:47.276542515Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:11:47.276553692Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:11:47.276558314Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:11:47.276562344Z [err]    clientVersion: '6.19.3',
2026-05-11T10:11:47.276566471Z [err]    errorCode: undefined,
2026-05-11T10:11:47.276570268Z [err]    retryable: undefined
2026-05-11T10:11:47.276574539Z [err]  }
2026-05-11T10:11:47.276578859Z [err]  
2026-05-11T10:11:47.276582865Z [err]  Node.js v20.20.2
2026-05-11T10:11:47.276587115Z [inf]  ◇ injected env (0) from .env // tip: ⌘ suppress logs { quiet: true }
2026-05-11T10:11:47.276591146Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:11:47.276595007Z [err]  /app/dist/main.js:32464
2026-05-11T10:11:47.276599259Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:11:47.276603142Z [err]                                                                              ^
2026-05-11T10:11:47.276606855Z [err]  
2026-05-11T10:11:47.276610864Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:11:47.276615744Z [err]  
2026-05-11T10:11:47.276623434Z [err]  This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-openssl-3.0.x.so.node" next to the resulting bundle.