// src/types/autosize.d.ts

declare module 'autosize' {
  /**
   * Initializes autosize on a single textarea element.
   * @param textarea - The textarea element to apply autosize to.
   */
  function autosize(textarea: HTMLTextAreaElement): void;

  /**
   * Initializes autosize on multiple textarea elements.
   * @param textareas - A list of textarea elements to apply autosize to.
   */
  function autosize(textareas: NodeListOf<HTMLTextAreaElement>): void;

  /**
   * Removes autosize from a textarea element.
   * @param textarea - The textarea element to remove autosize from.
   */
  function destroy(textarea: HTMLTextAreaElement): void;

  export default autosize;
}
