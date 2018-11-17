/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* global getParticipantRegistry emit */


/**
 * EarnPoints transaction
 * @param {org.clp.biznet.EarnPoints} earnPoints
 * @transaction
 */
async function EarnPoints( earnPoints ) {

	//update member points
	earnPoints.member.points = earnPoints.member.points + earnPoints.points;

	//update member
	const memberRegistry = await getParticipantRegistry( 'org.clp.biznet.Member' );
	await memberRegistry.update( earnPoints.member );

	// check if partner exists on the network
	const partnerRegistry = await getParticipantRegistry( 'org.clp.biznet.Partner' );
	partnerExists = await partnerRegistry.exists( earnPoints.partner.id );
	if ( partnerExists == false ) {
		throw new Error( 'Partner does not exist - check partner id' );
	}

}


/**
 * UsePoints transaction
 * @param {org.clp.biznet.UsePoints} usePoints
 * @transaction
 */
async function UsePoints( usePoints ) {

	//check if member has sufficient points
	if ( usePoints.member.points < usePoints.points ) {
		throw new Error( 'Insufficient points' );
	}

	//update member points
	usePoints.member.points = usePoints.member.points - usePoints.points

	//update member
	const memberRegistry = await getParticipantRegistry( 'org.clp.biznet.Member' );
	await memberRegistry.update( usePoints.member );

	// check if partner exists on the network
	const partnerRegistry = await getParticipantRegistry( 'org.clp.biznet.Partner' );
	partnerExists = await partnerRegistry.exists( usePoints.partner.id );
	if ( partnerExists == false ) {
		throw new Error( 'Partner does not exist - check id' );
	}
}

// Member's Points Value Total +
/**
 * Sample transaction processor function.
 * @param {org.example.basic.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
async function newPointsTotal( assetId, EarnPoints ) {
	assetId.value = assetId.value + EarnPoints;
	if ( assetId.value < 0 ) assetId.value = 0;

	let logEvent = getFactory().newEvent( 'org.example.basic.SampleTransaction', 'logEvent' );
	logEvent.assetValue = tx.assetValue;
	logEvent.oldValue = oldValue;
	logEvent.PointsTx = tx.PointsTx;
	emit( logEvent );
}


// Member's New Value After Redeeming/Using Points -
/**
 * Sample transaction processor function.
 * @param {org.example.basic.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
async function postRedeemedValue( assetId, UsePoints ) {
	assetId.value = assetId.value - UsePoints;
	if ( assetId.value < 0 ) assetId.value = 0;

	let logEvent = getFactory().newEvent( 'org.example.basic.SampleTransaction', 'logEvent' );
	logEvent.assetValue = tx.assetValue;
	logEvent.oldValue = oldValue;
	logEvent.PointsTx = tx.PointsTx;
	emit( logEvent );
}
