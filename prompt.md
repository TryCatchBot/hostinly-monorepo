2026-05-11T10:03:24.898807733Z [inf]  Starting Container
2026-05-11T10:03:25.811869512Z [inf]  ◇ injected env (0) from .env // tip: ⌘ override existing { override: true }
2026-05-11T10:03:25.811876112Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:25.811881003Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:25.811885550Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:25.811886072Z [err]  
2026-05-11T10:03:25.811889321Z [err]                                                                              ^
2026-05-11T10:03:25.811894080Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:25.811899898Z [err]  
2026-05-11T10:03:25.811903192Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:25.811909033Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:25.811913087Z [err]  
2026-05-11T10:03:25.811979088Z [err]  generator client {
2026-05-11T10:03:25.811984706Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:25.811989660Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:25.811995035Z [err]  The following locations have been searched:
2026-05-11T10:03:25.811996110Z [err]  }
2026-05-11T10:03:25.811999646Z [err]    /app/src/generated/client
2026-05-11T10:03:25.812004400Z [err]  
2026-05-11T10:03:25.812006627Z [err]    /app
2026-05-11T10:03:25.812010703Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:25.812013484Z [err]    /.prisma/client
2026-05-11T10:03:25.812016669Z [err]    /tmp/prisma-engines
2026-05-11T10:03:25.812056071Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:25.812886567Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:25.812889394Z [err]  
2026-05-11T10:03:25.812892188Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:25.812895568Z [err]  Node.js v20.20.2
2026-05-11T10:03:25.812897678Z [err]  
2026-05-11T10:03:25.812901723Z [inf]  ◇ injected env (0) from .env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
2026-05-11T10:03:25.812903417Z [err]  generator client {
2026-05-11T10:03:25.812906471Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:25.812910442Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:25.812911760Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:25.812915477Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:25.812916890Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:25.812920670Z [err]                                                                              ^
2026-05-11T10:03:25.812923908Z [err]  
2026-05-11T10:03:25.812926980Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:25.812931252Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:25.812932003Z [err]  
2026-05-11T10:03:25.812935717Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:25.812939357Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:25.812942855Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:25.812946408Z [err]    errorCode: undefined,
2026-05-11T10:03:25.812949272Z [err]    retryable: undefined
2026-05-11T10:03:25.812952530Z [err]  }
2026-05-11T10:03:25.814471511Z [err]  }
2026-05-11T10:03:25.814474754Z [err]  
2026-05-11T10:03:25.814477902Z [err]  The following locations have been searched:
2026-05-11T10:03:25.814481149Z [err]    /app/src/generated/client
2026-05-11T10:03:25.814484427Z [err]    /app
2026-05-11T10:03:25.814487716Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:25.814490933Z [err]    /.prisma/client
2026-05-11T10:03:25.814494339Z [err]    /tmp/prisma-engines
2026-05-11T10:03:25.814497843Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:25.814501204Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:25.814504847Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:25.814508543Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:25.814511764Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:25.814514676Z [err]    errorCode: undefined,
2026-05-11T10:03:25.814517815Z [err]    retryable: undefined
2026-05-11T10:03:25.814521933Z [err]  }
2026-05-11T10:03:25.814525270Z [err]  
2026-05-11T10:03:25.814528360Z [err]  Node.js v20.20.2
2026-05-11T10:03:25.945152316Z [inf]  ◇ injected env (0) from .env // tip: ⌘ override existing { override: true }
2026-05-11T10:03:25.945156675Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:25.959205673Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:25.959209088Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:25.959212918Z [err]                                                                              ^
2026-05-11T10:03:25.959218183Z [err]  
2026-05-11T10:03:25.959222149Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:25.959225373Z [err]  
2026-05-11T10:03:25.959229038Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:25.959232172Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:25.959235319Z [err]  
2026-05-11T10:03:25.959238549Z [err]  generator client {
2026-05-11T10:03:25.959242493Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:25.959246330Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:25.959250067Z [err]  }
2026-05-11T10:03:25.959253808Z [err]  
2026-05-11T10:03:25.959257480Z [err]  The following locations have been searched:
2026-05-11T10:03:25.959261555Z [err]    /app/src/generated/client
2026-05-11T10:03:25.959264751Z [err]    /app
2026-05-11T10:03:25.959267785Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:25.959271053Z [err]    /.prisma/client
2026-05-11T10:03:25.959274006Z [err]    /tmp/prisma-engines
2026-05-11T10:03:25.959276921Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:25.959279908Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:25.959282936Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:25.960519559Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:25.960523194Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:25.960525957Z [err]    errorCode: undefined,
2026-05-11T10:03:25.960529100Z [err]    retryable: undefined
2026-05-11T10:03:25.960532428Z [err]  }
2026-05-11T10:03:25.960535533Z [err]  
2026-05-11T10:03:25.960538294Z [err]  Node.js v20.20.2
2026-05-11T10:03:26.586848458Z [inf]  ◇ injected env (0) from .env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
2026-05-11T10:03:26.593822209Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:26.814903711Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:26.814906121Z [err]  
2026-05-11T10:03:26.814912885Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:26.814915327Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:26.814919187Z [err]  
2026-05-11T10:03:26.814924699Z [err]  
2026-05-11T10:03:26.814924927Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:26.814927289Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:26.814927401Z [err]  The following locations have been searched:
2026-05-11T10:03:26.814932043Z [err]  }
2026-05-11T10:03:26.814932987Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:26.814936167Z [err]    /app/src/generated/client
2026-05-11T10:03:26.814946161Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:26.814951331Z [err]    /app
2026-05-11T10:03:26.814952165Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:26.814953625Z [err]    /tmp/prisma-engines
2026-05-11T10:03:26.814956205Z [err]  
2026-05-11T10:03:26.814959835Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:26.814960270Z [err]                                                                              ^
2026-05-11T10:03:26.814962141Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:26.814963494Z [err]  generator client {
2026-05-11T10:03:26.814968457Z [err]    /.prisma/client
2026-05-11T10:03:26.814970193Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:26.815371524Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:26.815374998Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:26.815378527Z [err]    errorCode: undefined,
2026-05-11T10:03:26.815382110Z [err]    retryable: undefined
2026-05-11T10:03:26.815385190Z [err]  }
2026-05-11T10:03:26.815388889Z [err]  
2026-05-11T10:03:26.815392187Z [err]  Node.js v20.20.2
2026-05-11T10:03:27.255073268Z [inf]  ◇ injected env (0) from .env // tip: ⌘ enable debugging { debug: true }
2026-05-11T10:03:27.255077319Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:27.268877098Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:27.268884633Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:27.268890025Z [err]                                                                              ^
2026-05-11T10:03:27.268894300Z [err]  
2026-05-11T10:03:27.268898754Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:27.268903556Z [err]  
2026-05-11T10:03:27.268908706Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:27.268914498Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:27.268919778Z [err]  
2026-05-11T10:03:27.268924294Z [err]  generator client {
2026-05-11T10:03:27.268949407Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:27.268954067Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:27.268959381Z [err]  }
2026-05-11T10:03:27.268964452Z [err]  
2026-05-11T10:03:27.268967988Z [err]  The following locations have been searched:
2026-05-11T10:03:27.268971380Z [err]    /app/src/generated/client
2026-05-11T10:03:27.268975070Z [err]    /app
2026-05-11T10:03:27.268979414Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:27.268983553Z [err]    /.prisma/client
2026-05-11T10:03:27.268987612Z [err]    /tmp/prisma-engines
2026-05-11T10:03:27.268991793Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:27.268996196Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:27.269000422Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:27.270165655Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:27.270170438Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:27.270173750Z [err]    errorCode: undefined,
2026-05-11T10:03:27.270177365Z [err]    retryable: undefined
2026-05-11T10:03:27.270180334Z [err]  }
2026-05-11T10:03:27.270183036Z [err]  
2026-05-11T10:03:27.270186144Z [err]  Node.js v20.20.2
2026-05-11T10:03:27.866734573Z [inf]  ◇ injected env (0) from .env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
2026-05-11T10:03:27.866740662Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:27.879233741Z [err]    /tmp/prisma-engines
2026-05-11T10:03:27.879237946Z [err]  generator client {
2026-05-11T10:03:27.879239492Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:27.879244579Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:27.879244687Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:27.879250794Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:27.879251710Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:27.879253527Z [err]    /app
2026-05-11T10:03:27.879257260Z [err]  }
2026-05-11T10:03:27.879262586Z [err]  
2026-05-11T10:03:27.879265083Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:27.879268391Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:27.879268793Z [err]  The following locations have been searched:
2026-05-11T10:03:27.879272474Z [err]    /.prisma/client
2026-05-11T10:03:27.879274933Z [err]    /app/src/generated/client
2026-05-11T10:03:27.879277690Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:27.879281619Z [err]                                                                              ^
2026-05-11T10:03:27.879285485Z [err]  
2026-05-11T10:03:27.879288937Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:27.879292217Z [err]  
2026-05-11T10:03:27.879295488Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:27.879298491Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:27.879301509Z [err]  
2026-05-11T10:03:27.880435138Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:27.880438608Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:27.880441507Z [err]    errorCode: undefined,
2026-05-11T10:03:27.880444249Z [err]    retryable: undefined
2026-05-11T10:03:27.880446890Z [err]  }
2026-05-11T10:03:27.880449618Z [err]  
2026-05-11T10:03:27.880455484Z [err]  Node.js v20.20.2
2026-05-11T10:03:28.479789427Z [inf]  ◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
2026-05-11T10:03:28.480971887Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:28.493841979Z [err]  
2026-05-11T10:03:28.493843572Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:28.493846491Z [err]    /app
2026-05-11T10:03:28.493851580Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:28.493852302Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:28.493854414Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:28.493857625Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:28.493862454Z [err]    /.prisma/client
2026-05-11T10:03:28.493863489Z [err]  The following locations have been searched:
2026-05-11T10:03:28.493866120Z [err]  
2026-05-11T10:03:28.493869350Z [err]    /tmp/prisma-engines
2026-05-11T10:03:28.493871262Z [err]    /app/src/generated/client
2026-05-11T10:03:28.493872372Z [err]  generator client {
2026-05-11T10:03:28.493875206Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:28.493878873Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:28.493884390Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:28.493884969Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:28.493890233Z [err]                                                                              ^
2026-05-11T10:03:28.493891922Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:28.493895983Z [err]  
2026-05-11T10:03:28.493898033Z [err]  }
2026-05-11T10:03:28.493900948Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:28.493903557Z [err]  
2026-05-11T10:03:28.495334036Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:28.495338619Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:28.495342879Z [err]    errorCode: undefined,
2026-05-11T10:03:28.495346449Z [err]    retryable: undefined
2026-05-11T10:03:28.495350064Z [err]  }
2026-05-11T10:03:28.495353365Z [err]  
2026-05-11T10:03:28.495356472Z [err]  Node.js v20.20.2
2026-05-11T10:03:29.098387314Z [inf]  ◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
2026-05-11T10:03:29.098390335Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:29.108028092Z [err]    /app
2026-05-11T10:03:29.108034388Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:29.108038698Z [err]    /.prisma/client
2026-05-11T10:03:29.108042553Z [err]    /tmp/prisma-engines
2026-05-11T10:03:29.108047670Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:29.108050957Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:29.108056652Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:29.108069061Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:29.108073422Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:29.108077367Z [err]                                                                              ^
2026-05-11T10:03:29.108082621Z [err]  
2026-05-11T10:03:29.108086988Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:29.108090808Z [err]  
2026-05-11T10:03:29.108094972Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:29.108099204Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:29.108102877Z [err]  
2026-05-11T10:03:29.108107212Z [err]  generator client {
2026-05-11T10:03:29.108110747Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:29.108116616Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:29.108119905Z [err]  }
2026-05-11T10:03:29.108124549Z [err]  
2026-05-11T10:03:29.108128226Z [err]  The following locations have been searched:
2026-05-11T10:03:29.108132421Z [err]    /app/src/generated/client
2026-05-11T10:03:29.109385641Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:29.109388799Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:29.109391605Z [err]    errorCode: undefined,
2026-05-11T10:03:29.109394950Z [err]    retryable: undefined
2026-05-11T10:03:29.109398201Z [err]  }
2026-05-11T10:03:29.109400956Z [err]  
2026-05-11T10:03:29.109403807Z [err]  Node.js v20.20.2
2026-05-11T10:03:29.806961983Z [err]    /.prisma/client
2026-05-11T10:03:29.806964703Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:29.806970689Z [err]    /tmp/prisma-engines
2026-05-11T10:03:29.806972357Z [inf]  ◇ injected env (0) from .env // tip: ⌘ override existing { override: true }
2026-05-11T10:03:29.806976239Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:29.806977535Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:29.806985073Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:29.806985146Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:29.806988962Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:29.806993279Z [err]  
2026-05-11T10:03:29.806993412Z [err]  }
2026-05-11T10:03:29.806998089Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:29.807000740Z [err]  generator client {
2026-05-11T10:03:29.807005239Z [err]  
2026-05-11T10:03:29.807006480Z [err]                                                                              ^
2026-05-11T10:03:29.807008335Z [err]    /app
2026-05-11T10:03:29.807008743Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:29.807013384Z [err]  
2026-05-11T10:03:29.807016472Z [err]  The following locations have been searched:
2026-05-11T10:03:29.807019972Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:29.807020101Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:29.807025445Z [err]    /app/src/generated/client
2026-05-11T10:03:29.807026186Z [err]  
2026-05-11T10:03:29.807221348Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:29.807224590Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:29.807228151Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:29.807233794Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:29.807237149Z [err]    errorCode: undefined,
2026-05-11T10:03:29.807240364Z [err]    retryable: undefined
2026-05-11T10:03:29.807244042Z [err]  }
2026-05-11T10:03:29.807247967Z [err]  
2026-05-11T10:03:29.807251550Z [err]  Node.js v20.20.2
2026-05-11T10:03:30.444269508Z [inf]  ◇ injected env (0) from .env // tip: ⌘ suppress logs { quiet: true }
2026-05-11T10:03:30.451347279Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:30.462155422Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:30.462156105Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:30.462159815Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:30.462164496Z [err]                                                                              ^
2026-05-11T10:03:30.462167695Z [err]  
2026-05-11T10:03:30.462170642Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:30.462173809Z [err]  
2026-05-11T10:03:30.462176419Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:30.462179951Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:30.462182702Z [err]  
2026-05-11T10:03:30.462185661Z [err]  generator client {
2026-05-11T10:03:30.462189071Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:30.462192915Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:30.462196669Z [err]  }
2026-05-11T10:03:30.462200626Z [err]  
2026-05-11T10:03:30.462204060Z [err]  The following locations have been searched:
2026-05-11T10:03:30.462207749Z [err]    /app/src/generated/client
2026-05-11T10:03:30.462211411Z [err]    /app
2026-05-11T10:03:30.462215203Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:30.462218131Z [err]    /.prisma/client
2026-05-11T10:03:30.462220819Z [err]    /tmp/prisma-engines
2026-05-11T10:03:30.462223392Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:30.462226067Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:30.465970602Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:30.465973973Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:30.465977855Z [err]    errorCode: undefined,
2026-05-11T10:03:30.465981969Z [err]    retryable: undefined
2026-05-11T10:03:30.465986110Z [err]  }
2026-05-11T10:03:30.465990100Z [err]  
2026-05-11T10:03:30.465994115Z [err]  Node.js v20.20.2
2026-05-11T10:03:31.036780288Z [inf]  ◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
2026-05-11T10:03:31.036785073Z [inf]  [ ready ] http://0.0.0.0:8080
2026-05-11T10:03:31.053203517Z [err]  /app/dist/main.js:32464
2026-05-11T10:03:31.053207186Z [err]    /tmp/prisma-engines
2026-05-11T10:03:31.053208911Z [err]        throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P(p, r.clientVersion);
2026-05-11T10:03:31.053216822Z [err]                                                                              ^
2026-05-11T10:03:31.053217747Z [err]      at ml (/app/dist/main.js:32464:77)
2026-05-11T10:03:31.053220777Z [err]  generator client {
2026-05-11T10:03:31.053225525Z [err]  
2026-05-11T10:03:31.053225860Z [err]      at async Object.loadLibrary (/app/dist/main.js:33086:31)
2026-05-11T10:03:31.053231231Z [err]    provider      = "prisma-client-js"
2026-05-11T10:03:31.053234374Z [err]  PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-openssl-3.0.x".
2026-05-11T10:03:31.053234737Z [err]      at async Qr.loadEngine (/app/dist/main.js:33217:58)
2026-05-11T10:03:31.053237829Z [err]    binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
2026-05-11T10:03:31.053240403Z [err]  
2026-05-11T10:03:31.053242454Z [err]  }
2026-05-11T10:03:31.053245490Z [err]  This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-musl-openssl-3.0.x".
2026-05-11T10:03:31.053247512Z [err]  
2026-05-11T10:03:31.053250485Z [err]  Add "linux-musl-openssl-3.0.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:
2026-05-11T10:03:31.053252921Z [err]  The following locations have been searched:
2026-05-11T10:03:31.053254987Z [err]  
2026-05-11T10:03:31.053257526Z [err]    /app/src/generated/client
2026-05-11T10:03:31.053260492Z [err]    /app
2026-05-11T10:03:31.053263649Z [err]    /Users/josh/Documents/dev/hostinly/hostinly-monorepo/apps/hostinly-backend/src/generated/client
2026-05-11T10:03:31.053268429Z [err]    /.prisma/client
2026-05-11T10:03:31.054806308Z [err]      at async Qr.instantiateLibrary (/app/dist/main.js:33196:72) {
2026-05-11T10:03:31.054810548Z [err]    clientVersion: '6.19.3',
2026-05-11T10:03:31.054814256Z [err]    errorCode: undefined,
2026-05-11T10:03:31.054817872Z [err]    retryable: undefined
2026-05-11T10:03:31.054820724Z [err]  }
2026-05-11T10:03:31.054823351Z [err]  
2026-05-11T10:03:31.054826072Z [err]  Node.js v20.20.2