/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';
import TaskInboxContainer from '../TaskInboxContainer';
import * as TaskInboxContext from '../../../../channel/TaskInbox/TaskInboxContext';
import { TaskInboxQueries } from '../../../../channel/TaskInbox/TaskInboxQueries';
import { TaskInboxGatewayApiImpl } from '../../../../channel/TaskInbox/TaskInboxGatewayApi';
import DevUIAppContextProvider from '../../../contexts/DevUIAppContextProvider';
import { TaskInboxContextProvider } from '../../../../channel/TaskInbox';
import { EmbeddedTaskInbox } from '@kogito-apps/task-inbox';

const MockQueries = jest.fn<TaskInboxQueries, []>(() => ({
  getUserTaskById: jest.fn(),
  getUserTasks: jest.fn()
}));
const getCurrentUser = jest.fn();
jest
  .spyOn(TaskInboxContext, 'useTaskInboxGatewayApi')
  .mockImplementation(
    () => new TaskInboxGatewayApiImpl(new MockQueries(), getCurrentUser)
  );

const appContextProps = {
  devUIUrl: 'http://localhost:9000',
  openApiPath: '/mocked',
  isProcessEnabled: false,
  isTracingEnabled: false,
  omittedProcessTimelineEvents: [],
  isStunnerEnabled: false,
  availablePages: [],
  customLabels: {
    singularProcessLabel: 'test-singular',
    pluralProcessLabel: 'test-plural'
  },
  diagramPreviewSize: { width: 100, height: 100 }
};

describe('TaskInboxContainer tests', () => {
  it('Snapshot', () => {
    const wrapper = mount(
      <DevUIAppContextProvider
        users={[{ id: 'John snow', groups: ['admin'] }]}
        {...appContextProps}
      >
        <TaskInboxContainer />
      </DevUIAppContextProvider>
    ).find('TaskInboxContainer');

    expect(wrapper).toMatchSnapshot();

    const forwardRef = wrapper.find(EmbeddedTaskInbox);
    expect(forwardRef.props().activeTaskStates).toStrictEqual([
      'Ready',
      'Reserved'
    ]);
    expect(forwardRef.props().allTaskStates).toStrictEqual([
      'Ready',
      'Reserved',
      'Completed',
      'Aborted',
      'Skipped'
    ]);
    expect(forwardRef.props().driver).not.toBeNull();
    expect(forwardRef.props().targetOrigin).toBe('http://localhost:9000');
  });
});
