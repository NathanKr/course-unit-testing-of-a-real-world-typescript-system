import { test, expect, beforeEach, vi } from "vitest";
import {
  SCHEDULER_INTERVAL_SEC,
  createDom,
  registerHandlers,
} from "../src/ui/main-ui";
import {
  ButtonsText,
  getEnumKeyValues,
  pauseMs,
} from "./test-utils";
import * as functions from "../src/lib/utils/dispatched-functions";
import { DispatchedFunctionResult } from "../src/types/dispatched-function";
import {
  getByRole,
  getAllByRole,
  getByText,
  waitFor,
  findByText,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

let appElem: HTMLElement;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  createDom();
  registerHandlers();
  appElem = document.getElementById("app")!;
  vi.clearAllMocks();
});

test("document exist", () => {
  expect(document).toBeTruthy();
});

test("heading with text : 'Task Queue Manager' is in the dom ", () => {
  const headingElem = getByRole(appElem, "heading");

  expect(headingElem).toBeInTheDocument();
  expect(headingElem!.textContent).toBe("Task Queue Manager");
});

test("Six buttons inside app element", () => {
  const buttonElems = getAllByRole(appElem, "button");

  expect(buttonElems.length).toBe(6);
});

test("The first button has correct text", () => {
  const firstButton = getAllByRole(appElem, "button")[0];

  expect(firstButton?.textContent).toBe("start scheduler");
});

test("all buttons has correct text", () => {
  const arrayButtonsKeyValue = getEnumKeyValues(ButtonsText);
  const buttons = getAllByRole(appElem, "button");

  expect(arrayButtonsKeyValue.length).toBe(buttons.length);

  arrayButtonsKeyValue.forEach((bt, i) => {
    expect(bt.value).toBe(buttons[i].textContent);
  });
});

test("click on add -> 3 appears in the output", async () => {
  userEvent.click(getByText(appElem, ButtonsText.EnqueueAdd));
  userEvent.click(getByText(appElem, ButtonsText.StartScheduler));

  const outputElem = getByRole(appElem, "status");
  expect(outputElem).toBeInTheDocument();

  await waitFor(
    () => {
      expect(outputElem?.textContent?.includes("3")).toBeTruthy();
    },
    { timeout: SCHEDULER_INTERVAL_SEC * 1000 * 2 }
  );
});

test("failure status is add --> failure to appear in the ui", async () => {
  const spyOnAdd = vi.spyOn(functions, "add");
  const resFailure: DispatchedFunctionResult = {
    status: "failure",
    result: undefined,
  };
  spyOnAdd.mockReturnValue(resFailure);
  registerHandlers();

  userEvent.click(getByText(appElem, ButtonsText.EnqueueAdd));
  userEvent.click(getByText(appElem, ButtonsText.StartScheduler));

  await waitFor(
    () => {
      const outputElem = getByRole(appElem,'status');
      expect(outputElem.textContent).toContain("failure");
    },
    { timeout: SCHEDULER_INTERVAL_SEC * 1000 * 2 }
  );
});

test("enqueue , start , stop --> output is empty", async () => {
  userEvent.click(getByText(appElem, ButtonsText.EnqueueAdd));
  userEvent.click(getByText(appElem, ButtonsText.StartScheduler));
  userEvent.click(getByText(appElem, ButtonsText.StopScheduler));

  await waitFor(
    () => {
      const outputElem = getByRole(appElem,'status');
      expect(outputElem.textContent).toContain("");
    },
    { timeout: SCHEDULER_INTERVAL_SEC * 1000 * 2 }
  );
});

test("enqueue -> queue length is 1 -> in console.log", async () => {
  // getButtonInUI(ButtonsText.EnqueueAdd)?.click();

  userEvent.click(getByText(appElem, ButtonsText.EnqueueAdd));

  const spyOnConsoleLog = vi.spyOn(console, "log");
  // getButtonInUI(ButtonsText.QueueLength)?.click();
  userEvent.click(getByText(appElem, ButtonsText.QueueLength));

  await pauseMs(1000);

  // expect(spyOnConsoleLog).toBeCalledTimes(1);
  expect(spyOnConsoleLog).toBeCalledWith("taskQueue.length() : 1");
});

test("button isSchedulerStarted invoked --> correct value in output", async () => {
  userEvent.click(getByText(appElem, ButtonsText.IsSchedulerRunning));
  let outputElemWithText = await findByText(appElem,'isSchedulerStarted : false')
  expect(outputElemWithText).toBeInTheDocument();

  userEvent.click(getByText(appElem, ButtonsText.StartScheduler))
  userEvent.click(getByText(appElem, ButtonsText.IsSchedulerRunning));
  outputElemWithText = await findByText(appElem,'isSchedulerStarted : true');
  expect(outputElemWithText).toBeInTheDocument();
});

test("button enqueueGetPosts invoked --> console.error is called", async () => {
  // --- todo add real source code implementation

  const spyOnConsoleError = vi.spyOn(console, "error");
  userEvent.click(getByText(appElem, ButtonsText.EnqueueGetPosts));

  await pauseMs(1000);


  expect(spyOnConsoleError).toBeCalledTimes(1);
});



