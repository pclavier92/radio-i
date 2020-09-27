import React, { Fragment, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import radioiApi from 'Apis/radioi-api';
import Tooltip from 'Components/tooltip';
import SpotifyButton from 'Components/spotify-button';
import CustomCheckbox from 'Components/custom-checkbox';
import { useAuthentication } from 'Context/authentication';

const publicRadioTooltip = 'Will be published in the home page';
const collaborativeRadioTooltip =
  'Anyone will be able to add new songs to the radio';
const anonymousRadioTooltip = 'Your username will not be shown in the radio';

const StartRadio = ({ id }) => {
  const history = useHistory();
  const { user } = useAuthentication();

  const [radioname, setRadioname] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const onInputChange = useCallback(e => setRadioname(e.target.value), []);
  const onPublicChange = useCallback(e => setIsPublic(e.target.checked), []);
  const onCollaborativeChange = useCallback(
    e => setIsCollaborative(e.target.checked),
    []
  );
  const onAnonymousChange = useCallback(
    e => setIsAnonymous(e.target.checked),
    []
  );
  const startRadio = useCallback(
    async e => {
      e.preventDefault();
      try {
        const radioName = radioname !== '' ? radioname : 'Radio';
        const radioBy = isAnonymous ? '' : `by ${user.display_name}`;
        await radioiApi.startRadio(
          id,
          `${radioName} ${radioBy}`,
          isPublic,
          isCollaborative,
          isAnonymous
        );
        history.push(`/radio?id=${id}`);
      } catch (e) {
        console.log('Could not create radio');
      }
    },
    [id, user, radioname, isPublic, isCollaborative, isAnonymous]
  );

  return (
    <Fragment>
      <h2>Give your radio a name</h2>
      <h2>& start playing some music</h2>
      <form autoComplete="off">
        <input
          type="text"
          name="radio-name"
          id="radio-name"
          spellCheck="false"
          maxLength="35"
          onChange={onInputChange}
        />
        <div className="row">
          <div className="col span-1-of-2">
            <SpotifyButton onClick={startRadio}>Start your radio</SpotifyButton>
          </div>
          <div className="col span-1-of-2">
            <div>
              <CustomCheckbox
                id="is-public"
                onChange={onPublicChange}
                className="radio-option-checkbox"
              />
              <Tooltip text={publicRadioTooltip}>
                <h3>Public Radio</h3>
              </Tooltip>
            </div>
            <div>
              <CustomCheckbox
                id="is-collaborative"
                onChange={onCollaborativeChange}
                className="radio-option-checkbox"
              />
              <Tooltip text={collaborativeRadioTooltip}>
                <h3>Collaborative Radio</h3>
              </Tooltip>
            </div>
            <div>
              <CustomCheckbox
                id="is-anonymous"
                onChange={onAnonymousChange}
                className="radio-option-checkbox"
              />
              <Tooltip text={anonymousRadioTooltip}>
                <h3>Anonymous Radio</h3>
              </Tooltip>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default StartRadio;
