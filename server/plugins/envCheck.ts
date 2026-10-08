import env from '../utils/env'

export default defineNitroPlugin(() => {
  // importing is enough; the module throws on evaluation
  void env
})
