# registry
npx apollo client:codegen \
  --config airdropSubql.config.js \
  --target=typescript \
  --useReadOnlyTypes \
  --passthroughCustomScalars \
  --customScalarsPrefix=GraphQL_ \
  --outputFlat src/__generated__/airdropSubql