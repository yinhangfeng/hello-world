export const ActionTypes = {
  UNDO: '@@my-store-undo/UNDO',
  REDO: '@@my-store-undo/REDO',
  JUMP: '@@my-store-undo/JUMP',
  CLEAR_HISTORY: '@@my-store-undo/CLEAR_HISTORY',
};

export const ActionCreators = {
  undo(model?: string) {
    return {
      type: model != null ? `${model}/${ActionTypes.UNDO}` : ActionTypes.UNDO,
    };
  },
  redo(model?: string) {
    return {
      type: model != null ? `${model}/${ActionTypes.REDO}` : ActionTypes.REDO,
    };
  },
  jump(index: number, model?: string) {
    return {
      type: model != null ? `${model}/${ActionTypes.JUMP}` : ActionTypes.JUMP,
      payload: index,
    };
  },
  clearHistory(model?: string) {
    return {
      type:
        model !== null
          ? `${model}/${ActionTypes.CLEAR_HISTORY}`
          : ActionTypes.CLEAR_HISTORY,
    };
  },
};
