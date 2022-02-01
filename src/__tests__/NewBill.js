import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import firebase from "../__mocks__/firebase";
import BillsUI from "../views/BillsUI.js";
import Firestore from "../app/Firestore";

// Mock - parameters for bdd Firebase & data fetching
jest.mock('../app/Firestore');


// Init onNavigate
const onNavigate = (pathname) => {
  document.body.innerHTML = pathname;
};
// Mock - parameters for bdd Firebase & data fetching
jest.mock("../app/Firestore");

// LocalStorage - Employee
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee",
  })
);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should load the form", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      expect(screen.getByLabelText("Type de dépense")).toBeTruthy();
    });
  });
});



describe('When I choose an image to upload', () => {
  test('Then the file input should get the file name', () => {
      // build user interface
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Init newBill
      const newBill = new NewBill({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
      });

      // Mock function handleChangeFile
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

      // Add Event and fire
      const inputFile = screen.getByTestId('file');
      inputFile.addEventListener('change', handleChangeFile);

      // Launch event
      fireEvent.change(inputFile, {
          target: {
              files: [new File(['image.png'], 'image.png', {
                  type: 'image/png'
              })],
          }
      });

      // handleChangeFile function must be called
      expect(handleChangeFile).toBeCalled();
      // The name of the file should be 'image.png'
      expect(inputFile.files[0].name).toBe('image.png');
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
      // HTML must contain 'hideErrorMessage'
      expect(html.includes("<div class=\"hideErrorMessage\" id=\"errorFileType\" data-testid=\"errorFile\">")).toBeTruthy();
  });
});


describe('When I add a file other than an image (jpg, jpeg or png)', () => {
    test('Then the error message should be display', async () => {
        // Build user interface
        const html = NewBillUI();
        document.body.innerHTML = html;

        // Init newBill
        const newBill = new NewBill({
            document,
            onNavigate,
            Firestore,
            localStorage: window.localStorage,
        });

        // Mock of handleChangeFile
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

        // Add Event and fire
        const inputFile = screen.getByTestId('file');
        inputFile.addEventListener('change', handleChangeFile);
        fireEvent.change(inputFile, {
            target: {
                files: [new File(['image.exe'], 'image.exe', {
                    type: 'image/exe'
                })],
            }
        });

        // handleChangeFile function must be called
        expect(handleChangeFile).toBeCalled();
        // The name of the file should be 'image.exe'
        expect(inputFile.files[0].name).toBe('image.exe');
        expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
        await waitFor(() => {
            // We wait for the error message to appear by removing the "hide" class
            expect(screen.getByTestId('errorFile').classList).toHaveLength(0);
        });
    });
});


describe("When I submit the form with an image (jpg, jpeg, png)", () => {
  test("Then it should create a new bill", () => {
    // Init firestore
    const firestore = null;

    // Build user interface
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Init newBill
    const newBill = new NewBill({
      document,
      onNavigate,
      firestore,
      localStorage: window.localStorage,
    });

    // mock of handleSubmit
    const handleSubmit = jest.fn(newBill.handleSubmit);

    // EventListener to submit the form
    const submitBtn = screen.getByTestId("form-new-bill");
    submitBtn.addEventListener("submit", handleSubmit);
    fireEvent.submit(submitBtn);

    // handleSubmit function must be called
    expect(handleSubmit).toHaveBeenCalled();
  });
});

// test d'intégration POST
describe("Given I am a user connected as an Employees", () => {
  describe("When I fill a new bill", () => {
    test("fetches new bill to mock API Post", async () => {
      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("fetches new bill from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
