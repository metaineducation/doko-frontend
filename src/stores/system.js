import { defineStore } from "pinia";

export default defineStore("system", {
  state: () => {
    return {
      diffTime: 0,
    };
  },
  actions: {
    updateDiffTime(systime) {
      this.diffTime = systime - Date.now();
    },
    getCurrentSysTime() {
      return Date.now() + (this.diffTime || 0);
    },
  },
});
