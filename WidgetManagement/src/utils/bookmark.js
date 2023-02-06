const KEY = "wmTools";

export default {
  /**
   * Get all tools saved in the localStorage and convert to array.
   *
   * @returns {Array} Array of tools.
   */
  get() {
    const wmTools = localStorage.getItem(KEY);
    return wmTools ? JSON.parse(wmTools) : [];
  },
  /**
   * Stringify array of tools and save to localStorage.
   *
   * @param {Array} tools Array of tools.
   */
  save(tools) {
    localStorage.setItem(KEY, JSON.stringify(tools));
  }
};
