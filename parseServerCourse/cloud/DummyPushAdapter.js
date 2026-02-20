import { PushAdapter } from 'parse-server/lib/Adapters/Push/PushAdapter.js'

class DummyPushAdapter extends PushAdapter {
   async send(body, installations, pushStatus) {
      // Do nothing - dummy implementation
      return Promise.resolve()
   }

   getValidPushTypes() {
      return []
   }
}

export default DummyPushAdapter
