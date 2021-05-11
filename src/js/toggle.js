export default function toggle(name) {
  const targetName = `data-${name}`;
  const targetAttr = `[${targetName}]`;
  const target = document.querySelector(targetAttr);
  const btnAttr = `[data-toggle='${name}']`;
  const toggleBtn = document.querySelector(btnAttr);

  const targetState = () => target.getAttribute(targetName);

  const syncState = (to) => {
    const syncTo = to || targetState();
    toggleBtn.setAttribute('aria-pressed', syncTo);
  };

  const toggleIt = () => {
    const setTo = targetState() === 'true' ? 'false' : 'true';
    target.setAttribute(targetName, setTo);
    syncState(setTo);
  };

  if (toggleBtn) {
    document.onload = syncState();
    toggleBtn.addEventListener('click', () => {
      toggleIt();
    });
  }
}
