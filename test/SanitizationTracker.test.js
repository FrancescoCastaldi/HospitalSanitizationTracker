const { expect } = require("chai"); // Importa expect per le asserzioni nei test
const { ethers } = require("hardhat"); // Importa ethers per interagire con il contratto e gestire gli account

describe("SanitizationTracker", function () {// Descrive il gruppo di test per il contratto SanitizationTracker
  let contract, admin, operator1, other;

  beforeEach(async function () { // Esegue questa funzione prima di ogni test per preparare l'ambiente
    [admin, operator1, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SanitizationTracker");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("Dovrebbe settare admin correttamente", async function () { // Test per verificare che l'admin sia stato impostato correttamente
    expect(await contract.admin()).to.equal(admin.address);
  });

  it("Dovrebbe registrare una area", async function () { // Test per verificare che un'area possa essere registrata correttamente
    await contract.registerArea(1, "Reparto A");
    const area = await contract.areas(1);
    expect(area.name).to.equal("Reparto A");
    expect(area.active).to.equal(true);
  });

  it("Non dovrebbe permettere a non-admin di registrare area", async function () { // Test per verificare che solo l'admin possa registrare un'area - misura di sicurezza da implementare nel pptx
    await expect(
      contract.connect(other).registerArea(1, "Reparto A")
    ).to.be.revertedWith("Only admin can perform this action");
  });

  it("Dovrebbe registrare un operatore", async function () { // Test per verificare che un operatore possa essere registrato correttamente
    await contract.registerOperator(operator1.address, "Mario Rossi");
    const op = await contract.operators(operator1.address);
    expect(op.name).to.equal("Mario Rossi");
    expect(op.active).to.equal(true);
  });

  it("Non dovrebbe permettere a non-admin di registrare operatore", async function () { // Test per verificare che solo l'admin possa registrare un operatore - misura di sicurezza da implementare nel pptx
    await expect(
      contract.connect(other).registerOperator(operator1.address, "Mario")
    ).to.be.revertedWith("Only admin can perform this action");
  });

  it("Dovrebbe registrare una sanificazione", async function () {
    await contract.registerArea(1, "Reparto A");
    await contract.registerOperator(operator1.address, "Mario Rossi");
    await contract.connect(operator1).sanitize(1, "Completata", "Nessuna anomalia");
    const count = await contract.getEventCount(1);
    expect(count).to.equal(1);
  });

  it("Non dovrebbe permettere a non-operatore di sanificare", async function () { // Test per verificare che solo un operatore registrato possa eseguire una sanificazione - misura di sicurezza da implementare nel pptx
    await contract.registerArea(1, "Reparto A");
    await expect(
      contract.connect(other).sanitize(1, "Completata", "Note")
    ).to.be.revertedWith("Operator not registered");
  });

  it("Dovrebbe recuperare ultima sanificazione", async function () { // Test per verificare che sia possibile recuperare l'ultima sanificazione di un'area
    await contract.registerArea(1, "Reparto A");
    await contract.registerOperator(operator1.address, "Mario Rossi");
    await contract.connect(operator1).sanitize(1, "Completata", "OK");
    const last = await contract.getLastSanitization(1);
    expect(last.outcome).to.equal("Completata");
  });

  it("Dovrebbe disattivare una area", async function () { // Test per verificare che un'area possa essere disattivata correttamente
    await contract.registerArea(1, "Reparto A");
    await contract.setAreaActive(1, false);
    const area = await contract.areas(1);
    expect(area.active).to.equal(false);
  });

  it("Dovrebbe disattivare un operatore", async function () { // Test per verificare che un operatore possa essere disattivato correttamente
    await contract.registerOperator(operator1.address, "Mario");
    await contract.setOperatorActive(operator1.address, false);
    const op = await contract.operators(operator1.address);
    expect(op.active).to.equal(false);
  });
});
