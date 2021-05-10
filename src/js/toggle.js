export default function toggle(name) {
  const targetName = `data-${name}`;
  const targetAttr = `[${targetName}]`;
  const btnAttr = `[data-toggle='${name}']`;
  const toggleBtn = document.querySelector(btnAttr);

  const getTarget = () => document.querySelector(targetAttr);
  const targetState = (target) => target.getAttribute(targetName);

  const syncState = (to) => {
    const target = getTarget();
    const syncTo = to || targetState(target);
    toggleBtn.setAttribute('aria-pressed', syncTo);
  };

  const toggleIt = () => {
    const target = getTarget();
    const setTo = targetState(target) === 'true' ? 'false' : 'true';
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
