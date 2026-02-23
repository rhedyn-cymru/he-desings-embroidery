function addToCart() {
  document.querySelectorAll('[data-cart-button]').forEach((button) => {
    button.addEventListener('click', () => {
      const originalText = button.textContent;
      button.textContent = 'Added';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    });
  });
}
export default addToCart;