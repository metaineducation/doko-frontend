import { onMounted, ref } from "vue";
import api from "../../../api";

export default function useCollections() {
  let collections = ref([]);

  async function getCollections() {
    let res = await api.metaverse.listAllMetaverses();
    api.r(res, () => {
      collections.value = res.data.value;
    });
  }

  onMounted(() => {
    getCollections();
  });

  return {
    collections,
  };
}
