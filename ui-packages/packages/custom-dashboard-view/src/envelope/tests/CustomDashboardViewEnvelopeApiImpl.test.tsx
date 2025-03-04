/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
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

import {
  MockedEnvelopeBusController,
  MockedCustomDashboardViewEnvelopeViewApi
} from './mocks/Mocks';
import { EnvelopeApiFactoryArgs } from '@kogito-tooling/envelope';
import {
  CustomDashboardViewChannelApi,
  CustomDashboardViewEnvelopeApi
} from '../../api';
import { CustomDashboardViewEnvelopeApiImpl } from '../CustomDashboardViewEnvelopeApiImpl';
import { CustomDashboardViewEnvelopeViewApi } from '../CustomDashboardViewEnvelopeView';
import { CustomDashboardViewEnvelopeContext } from '../CustomDashboardViewEnvelopeContext';

describe('CustomDashboardViewEnvelopeApiImpl tests', () => {
  it('initialize', () => {
    const envelopeBusController = MockedEnvelopeBusController;
    const view = new MockedCustomDashboardViewEnvelopeViewApi();
    const args: EnvelopeApiFactoryArgs<
      CustomDashboardViewEnvelopeApi,
      CustomDashboardViewChannelApi,
      CustomDashboardViewEnvelopeViewApi,
      CustomDashboardViewEnvelopeContext
    > = {
      envelopeBusController,
      envelopeContext: {},
      view: () => view
    };

    const envelopeApi = new CustomDashboardViewEnvelopeApiImpl(args);

    envelopeApi.customDashboardView__init(
      {
        envelopeServerId: 'envelopeServerId',
        origin: 'origin'
      },
      'name'
    );

    expect(envelopeBusController.associate).toHaveBeenCalledWith(
      'origin',
      'envelopeServerId'
    );
    expect(view.initialize).toHaveBeenCalled();
  });
});
